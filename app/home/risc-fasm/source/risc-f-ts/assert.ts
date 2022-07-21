import {parsed} from './compiler/parser.js'

export function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw msg
}

// Used when assertion arises while compiling
let line: parsed | null = null
export function setCurrentLine(currentLine: parsed): void {
  line = currentLine
}

export function getCurrentLine(): parsed {
  assert(line != null, 'Line not yet setted')
  return line
}

export function assertLine(cond: any, msg: string): asserts cond {
  assert(line != null, 'Line not yet setted')
  const {lineNumber, lineText} = line;
  assert(cond, `Error: ${msg}\n\tat line: ${lineNumber}: "${lineText}"`)
}

export enum registers { pc, sp, si, di, a, b, c, ram }

type operand = string | number
export function isRegister(register: string): boolean {
  // @ts-ignore
  return registers[register] !== undefined
}

function assertRegister(register: operand): registers {
  assertLine(typeof register == 'string', 'Not a valid register')
  assertLine(isRegister(register), 'Not a valid register')
  // @ts-ignore
  return registers[register]
}


export function assertRegisters(a: operand, b: operand, d: operand) {
  const regA = assertRegister(a)
  const regB = assertRegister(b)
  const regD = assertRegister(d)

	return (regA << 0) + (regB << 3) + (regD << 6)
}

const MIN_SIMM = -64
const MAX_SIMM = +63
const MIN_UIMM = 0
const MAX_UIMM = 127

export function assertImmediate(value: operand): number {
  assert(typeof value == 'number', 'Invalid operand')

  // non defined constant / label is Infinity in first pass
  if (value == Infinity) return Infinity

  assertLine(value >= MIN_SIMM, `Immedaite value ${value} below ${MIN_SIMM}`)
  assertLine(value <= MAX_SIMM, `Immedaite value ${value} above ${MAX_SIMM}`)

  if (value < 0) return MAX_UIMM + value + 1
  return value
}