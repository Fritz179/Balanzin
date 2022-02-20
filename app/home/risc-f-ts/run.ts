import {setCurrentLine, getCurrentLine, assertLine} from './assert.js'
import {execSet} from './compiler/instSet/instSet.js'
import {printState} from './print.js'
import {code, compiled, NUM_TO_REG} from './compiler/parser.js'

export interface value {
  value: number,  // hardware value
  creator: code   // who wrote this value, useful for debugging?
  line?: code,    // used for simulation, has opcode resolver
}

interface register {
  [key: string]: value
}

interface state {
  eeprom: value[],
  ram: value[],
  registers: register,
  currActions: [string, value][],
  prevActions: [string, value][][],
  running: boolean,
  flags: number,
  steps: number
}

export const state: state = {
  eeprom: [],
  ram: [],
  registers: {},
  currActions: [],
  prevActions: [],
  running: false,
  flags: 0,
  steps: 0,
}

let doDebug = false
function debug(...msg: any[]) {
  if (doDebug) console.log(...msg)
}

export enum flags {
  CF, ZF, NF
}

export function setFlag(flag: flags, to: boolean): void {
  if (to) {
    state.flags |= 1 << flag
  } else {
    state.flags &= ~(1 << flag)
  }
}

export function getFlag(flag: flags): number {
  return state.flags & (1 << flag)
}

export function setFlags(a: number, b: number, d: number): number {
	setFlag(flags.CF, d < 0 || d >= 65536)

  if (d < 0) d += 65536
  if (d >= 65536) d -= 65536

  setFlag(flags.NF, d >= 32278)
  setFlag(flags.ZF, d == 0)
	return d
}

export function readValue(location: string | number, empty: boolean): value {
  const i = Number(location)

  if (Number.isNaN(i)) {
    assertLine(NUM_TO_REG.includes(location as string), 'Invalid memory access')
    const value = state.registers[location]
    assertLine(value || empty, 'Invalid memory access')

    return value
  }

  // for now only acces eeprom
  const value = state.eeprom[i]
  assertLine(value || empty, 'Invalid memory access')
  return value
}

interface memory {
  [key: string]: number
}

export const memory = new Proxy([], {
	get(_from, index: string): number {
    debug('Getting', index, readValue(index, false).value)
    return readValue(index, false).value
	},

	set(_to, location: string, value: number) {
    debug('Setting', location, value)
    if (value > 65535 || value < 0) console.log('Invalid setting value')

    state.currActions.push([location, readValue(location, true)])
    const newValue: value = {value, creator: getCurrentLine() as code}

    const i = Number(location)

    if (Number.isNaN(i)) {
      assertLine(NUM_TO_REG.includes(location), 'Invalid memory access')
      state.registers[location] = newValue

      return true
    }

    // for now only set eeprom
    state.eeprom[i] = newValue
    return true
	}
}) as unknown as memory

function runNext(show: boolean) {
  const line = readValue(state.registers.pc.value, false).line!
  assertLine(line, 'No instruction at pc!')
  debug('Running: ' + line.inst)

  setCurrentLine(line)
  const resolver = execSet[line.inst]

  assertLine(resolver, 'Invalid instruction')
  resolver(...line.args.map(el => el.exec))

  memory['pc']++

  state.prevActions.push(state.currActions)
  state.currActions = []
  state.steps++
  if (show) printState()
}

function runBack() {
  if (!state.prevActions.length) return

  const undoActions = state.prevActions.pop()!
  while (undoActions.length) {
    const [index, value] = undoActions.pop()!
    const i = Number(index)
    if (Number.isNaN(i)) {
      state.registers[index] = value
    } else {
      state.eeprom[i] = value
    }
  }

  state.currActions = []
  state.steps--
  printState()
}

function start() {
  let i = 0
  const start = Date.now()
  while ((getCurrentLine() as code).inst != 'HLT') {
    runNext(false)
    assertLine(i < 10000, 'no HLT inst')
    i++
  }

  printState()
  const time = (Date.now() - start)
  console.log(`${Math.round(state.steps / time)}kHz`)
}

window.addEventListener('keydown', (e) => {
  if (!state.running) return

  try {
    switch (e.key) {
      case 'n': runNext(true); break;
      case 'b': runBack(); break;
      case 'd': doDebug = !doDebug; break;
      case 'i': console.log(state); break;
      case 's': start(); break;
    }
  } catch (e) {
    console.error(e);
    const output = document.getElementById('output')!
    output.innerHTML = `${e}\n\n${output.innerHTML}`
    output.classList.add('error')

    if (e instanceof Error) {
      throw e
    }
  }
})

export default function run(all: compiled[]) {
  const program = all.filter(el => el.type == 'code') as code[]

  if (!program.length) {
    state.running = false
    return
  }

  state.running = true

  state.eeprom = []
  state.ram = []
  state.registers = {
    pc: {value: 0, creator: program[0]},
    sp: {value: 0, creator: program[0]}
  }

  for (const line of program) {
    state.eeprom[line.bytePos] = {value: line.opcode, creator: line, line}
  }

  console.log(program)
  setCurrentLine(program[0])
  printState()
}