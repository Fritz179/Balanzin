export function assert(cond, msg) {
  if (!cond) throw msg
}

// Used when assertion arises while compiling
let line = null
let lastPass = false
export function setCurrentLine(currentLine) {
  line = currentLine
}
export function setLastPass(currentLastPass) {
  lastPass = currentLastPass
}

export function assertLine(cond, msg) {
  assert(cond, `Error: ${msg}\n\tat line: ${line.lineNumber}: "${line.line}"`)
}

const REGISTERS = { pc: 0, sp: 1, si: 2, di: 3, a: 4, b: 5, c: 6, ram: 7 }
const isRegister = register => typeof REGISTERS[register] == 'number'

function assertRegister(register) {
  if (register == Infinity) assertLine(false, 'Invalid register name')
  if (!register) assertLine(false, 'Missing operand')
}

export function assertRegisters(a, b, d) {
  assertRegister(a)
  assertRegister(b)
  assertRegister(d)

	return( REGISTERS[a] << 0) + (REGISTERS[b] << 3) + (REGISTERS[d] << 6)
}

const MIN_SIMM = -64
const MAX_SIMM = +63
const MIN_UIMM = 0
const MAX_UIMM = 127

export function assertImmediate(value) {
  if (value == Infinity && !lastPass) return Infinity

  assertLine(value >= MIN_SIMM, `Immedaite value ${value} below ${MIN_SIMM}`)
  assertLine(value <= MAX_SIMM, `Immedaite value ${value} above ${MAX_SIMM}`)

  if (value < 0) return MAX_UIMM + value + 1
  return value
}