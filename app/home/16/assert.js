export default function assert(condition, message) {
	if (!condition) throw message
}

export function assertLine(condition, line, message) {
	assert(condition, `Error: ${message}\n\tat line: ${line.lineNumber}: "${line.originalLine}"`)
}

export function hex(num, signed = false) {
	if (num < 0) {
		if (signed) {
			return '-0x' + (-num).toString(16).padStart(4, '0')
		}

		return '0x' + (0xffff+num).toString(16).padStart(4, '0')
	}

	return '0x' + num.toString(16).padStart(4, '0')
}

const REGS = { pc: 0, sp: 1, si: 2, di: 3, a: 4, b: 5, c: 6, ram: 7 }
const isReg = op => typeof REGS[op] == 'number'

export function regToOp(inst, a, b, d) {
	assertLine(isReg(a), inst, `Invalid operand "${a}"`)
	assertLine(isReg(b), inst, `Invalid operand "${b}"`)
	assertLine(isReg(d), inst, `Invalid operand "${d}"`)

	return REGS[a] + (REGS[b] << 3) + (REGS[d] << 6)
}

// immToOp, numToOp

export function immToOp(inst, val, signed) {
	if (signed) {
		assertLine(val >= -63 && val < 64, inst,
			`Immediate: ${val} out of bounds (-64/63)`)
		if (val >= 0) return val
		return 63 - val
		// 64 = -1
		// 65 = -2
		// 127 = -64
	}

	assertLine(val >= 0 && val < 128, inst,
		`Immediate: ${val} out of bounds (0/127)`)
	return val
}

export function numToOp(inst, val, signed) {
	if (signed) {
		assertLine(val >= -32768 && val < 32768, inst,
			`Immediate: ${val} out of bounds (-32768/32767)`)

		if (val >= 0) return val
		return 32767 - val
	}

	assertLine(val >= 0 && val < 65536, inst,
		`Immediate: ${val} out of bounds (0/65535)`)
	return val
}
