import {line} from './parse.js'

export function assert(cond: any, msg: string) {
  if (!cond) throw msg
}

// Used when assertion arises while compiling
let line: line | null = null
let lastPass: boolean = false
export function setCurrentLine(currentLine: line): void {
  line = currentLine
}
export function getCurrentLine(): line {
  assert(line != null, 'Line not yet setted')
  return line as line
}

export function setLastPass(currentLastPass: boolean): void {
  lastPass = currentLastPass
}

export function assertLine(cond: any, msg: string) {
  assert(line != null, 'Line not yet setted')
  const {lineNumber, lineText} = line as line;
  assert(cond, `Error: ${msg}\n\tat line: ${lineNumber}: "${lineText}"`)
}

import {REG_TO_NUM, NUM_TO_REG} from './parse.js'

type operand = string | number
function assertRegister(register: operand) {
  assertLine(typeof register == 'string', 'Invaldi register')
  assertLine(NUM_TO_REG.includes(register as string), 'Missing operand')
}

export function assertRegisters(a: operand, b: operand, d: operand) {
  assertRegister(a)
  assertRegister(b)
  assertRegister(d)

	return (REG_TO_NUM[a] << 0) + (REG_TO_NUM[b] << 3) + (REG_TO_NUM[d] << 6)
}

const MIN_SIMM = -64
const MAX_SIMM = +63
const MIN_UIMM = 0
const MAX_UIMM = 127

export function assertImmediate(value: operand): number {
  assert(typeof value == 'number', 'Invalid operand')
  if (value == Infinity && !lastPass) return Infinity

  assertLine(value >= MIN_SIMM, `Immedaite value ${value} below ${MIN_SIMM}`)
  assertLine(value <= MAX_SIMM, `Immedaite value ${value} above ${MAX_SIMM}`)

  if (value < 0) return MAX_UIMM + (value as number) + 1
  return value as number
}