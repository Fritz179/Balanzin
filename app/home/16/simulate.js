import {opToInst} from './decode.js'
import assert, {hex} from './assert.js'

let REGS = {
  a: null, b: null, c: null, si: null, di: null, sp: null, pc: 0
}

function assertNumber(num) {
  const ret = Number(num)
  assert(num >= 0 && num < 65536, 'Cannot write ' + num)
  return ret
}

function get(reg) {
  const ret = REGS[reg]
  if (ret == null) throw 'Reading unwritten reg'
  return ret
}

function set(reg, to) {
  assert(typeof REGS[reg] != 'undefined', 'Not a valid register ' + reg)
  REGS[reg] = assertNumber(to)
}

function read(location, ram) {
  const num = assertNumber(location)
  return ram[num]
}

function write(location, ram, to) {
  const num = assertNumber(location)
  return ram[num] = assertNumber(to)
}

function inc() {
  const to = assertNumber(REGS.pc + 1)
  REGS.pc = to
}

function exec([op, a, b, d], ram) {
  console.log('Executing:', op, a, b, d);
  switch (op) {
    case 'ldi':
      set(a, b)
      inc()
      break;
    case 'lod':
      set(a, read(b, ram))
      inc()
      inc()
      break;
    case 'sto':
      write(get(a), ram, b == 'pc' ? 0 : get(b))
      inc()
      break;
    case 'jmp':
      set('pc', assertNumber(a))
      break;
    case 'shl':
      set(a, (get(b) << 1) & 65535)
      inc()
      break;
    case 'or':
      set(a, (get(b) | get(d)))
      inc()
      break;
    case 'xor':
      if (b == d) {
        set(a, 0)
      } else {
        set(a, (get(b) ^ get(d)))
      }
      inc()
      break;
    default:
      console.log('Unknown OP in simulation', op);
  }
}

// if lod skips next instruction because it's data, but what if it isn't?

let symMemory, symSource, symLocations
export default async function simulate(memory, source, locations) {
  symMemory = [...memory]
  symSource = [...source]
  symLocations = locations

  REGS = {
    a: null, b: null, c: null, si: null, di: null, sp: null, pc: 0
  }

  // simulateOne()
  printStatus()
}

function simulateOne() {
  assert(symMemory, 'Simulation not started')

  const word = symMemory[REGS.pc]
  // word2 isn't needed for simulation
  const word2 = symMemory[REGS.pc + 1]

  const split = s => s.replaceAll(',', '').split(/ +/)
  const inst = split(opToInst(REGS.pc, word, word2, true))
  exec(inst, symMemory)

  printStatus()
}

window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'n': simulateOne(); break;
    default:
      console.log(event.key);
  }
})

const printRegs = ['a', 'b', 'c', 'si', 'di', 'sp', 'pc']
function printStatus() {
  let out = ''

  // Register status
  printRegs.forEach(reg => {
    const value = REGS[reg] == null ? '0x????' : hex(REGS[reg])
    const ptr = getValueAt(REGS[reg])
    out += `${`${reg}:`.padEnd(3, ' ')} ${value}${ptr}\n`
  })

  // Show previous 3 inst, space, current inst, space, necx 3 insts
  const pc = REGS.pc
  const start = pc - 5
  const end = pc + 5

  function printLine(pos) {
    if (typeof symMemory[pos] == 'undefined') {
      return `${hex(pos)}: null   | rüt\n`
    }

    const source = symSource[pos]
    const word = symMemory[pos]
    const word2 = symMemory[pos + 1] || 0

    if (source) {
      const sol = source.originalLine || source.printLine

      if (sol.match(/(.*?:)?dw/) || sol.match(/ *imm/)) {
        return `${hex(pos)}: ${hex(word)} | data!\n`
      }
    }

    const inst = opToInst(pos, word, word2, true) || 'data?'
    return `${hex(pos)}: ${hex(word)} | ${inst}\n`
  }

  out += '\n'
  // pre
  for (let i = start; i < pc; i++) {
    out += printLine(i < 0 ? 65536 + i : i)
  }

  out += `<span style="color: #4f4">------\n${printLine(pc)}------\n</span>`

  // after
  for (let i = pc + 1; i <= end; i++) {
    out += printLine(i >= 65536 ? i - 65536 : i)
  }

  function getValueAt(loc, depth = 0) {
    if (depth > 5) return ''

    if (loc == 0) return ''

    const value = symMemory[loc]

    if (typeof value == 'undefined') return ''

    if (value == 0) return ' -> NULL'

    return ` -> ${hex(value)}${getValueAt(value, depth + 1)}`
  }

  out += '\n'

  for (const key in symLocations) {
    if (key[0] == '$') continue

    out += `${key.padEnd(15, ' ')} = ${hex(symLocations[key])}${getValueAt(symLocations[key])}\n`
  }

  document.getElementById('pre').innerHTML = out
}
