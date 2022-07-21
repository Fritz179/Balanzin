import {setCurrentLine, getCurrentLine, assertLine, assert} from './assert.js'
import {execSet} from './instSet/instSet.js'
import {printState} from './print.js'

let eeprom = []
let ram = []
let registers = {}
let running = false
let currActions = []
const prevActions = []

const registerNames = ['a', 'b', 'c', 'si', 'di', 'pc', 'sp']

function readMemory(location) {
  return eeprom[location]
}

const memory = new Proxy([], {
	get(from, index) {
		const i = Number(index)

    // memory access
    if (!Number.isNaN(i)) {
      return readMemory(i).value
    }

    assertLine(registerNames.includes(index), `Invalid memory store: ${index}`)
    assertLine(registers[index], `Accessing register: ${index} before clear`)

    // register access
    return registers[index].value
	},

	set(to, index, value) {
    const i = Number(index)

    // memory access
    if (!Number.isNaN(i)) {
      currActions.push([index, readMemory(i)])
      assertLine(false, 'not implemented')
      return true
    }

    assertLine(registerNames.includes(index), `Invalid memory store: ${index}`)

    // register access
    currActions.push([index, registers[index]])
    registers[index] = {value, line: getCurrentLine()}
    return true
	}
})

function runNext() {
  const nextInst = readMemory(registers.pc.value)

  assertLine(nextInst, 'No instruction at pc!')

  const {line} = nextInst
  setCurrentLine(line)
  const resolver = execSet[line.inst]

  assertLine(resolver, 'Invalid instruction')
  console.log(line);
  resolver(memory, ...line.args.map(el => el.exec))

  memory.pc++

  prevActions.push(currActions)
  currActions = []
  printState(registers, readMemory)
}

function runBack() {
  if (!prevActions.length) return

  const undoActions = prevActions.pop()
  while (undoActions.length) {
    const [index, value] = undoActions.pop()
    registers[index] = value
  }

  currActions = []
  printState(registers, readMemory)
}

function inspect() {
  console.log('\nREGISTES:')
  console.log(registers);
  console.log('\nEEPROM:')
  console.log(eeprom);
  console.log('\nRAM:')
  console.log(ram);
}

window.addEventListener('keydown', (e) => {
  if (!running) return

  try {
    switch (e.key) {
      case 'n': runNext(); break;
      case 'b': runBack(); break;
      case 'i': inspect(); break;
      case 'a': console.log(prevActions); break;
    }
  } catch (e) {
    console.error(e);
    const output = document.getElementById('output')
    output.innerHTML = `${e}\n\n${output.innerHTML}`
    output.classList.add('error')

    if (e instanceof Error) {
      throw e
    }
  }
})

export default function run(program) {
  if (!program) {
    running = false
    return
  }
  running = true

  eeprom = []
  ram = []
  registers = {pc: {value: 0, line: 'RESET'}}

  for (const line of program) {
    if (line.opcode != null) {
      eeprom[line.bytePos] = {value: line.opcode, line}
    }
  }

  assert(eeprom[0], 'Running invalid program')

  printState(registers, readMemory)
}