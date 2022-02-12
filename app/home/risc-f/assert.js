export function assertUnreachable(msg = 'assertUnreachable') {
  throw msg
}

export function assert(cond, msg) {
  if (!cond) assertUnreachable(msg)
}

// Used when assertion arises while compiling
let line = null
export function setCurrentLine(currentLine) {
  line = currentLine
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