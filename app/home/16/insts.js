import assert, {regToOp, assertLine, immToOp, numToOp, hex} from './assert.js'

export const insts = {}
export const aluOPS = {}
function addBinOP(name, opcode) {
	aluOPS[opcode] = name
	insts[name] = (inst, consts, d, s1, s2) => {
    assertLine(d && s1, inst, `Not enough parameters for ${name} instruction!`)
    if (!s2) s2 = d
		const ops = regToOp(inst, s1, s2, d)

		return [[
		1, (locations, pos) => {
			return [[(opcode << 9) + ops, inst]]
		}]]
	}
}

function addUnaOP(name, opcode) {
	aluOPS[opcode] = name
	insts[name] = (inst, consts, d, s) => {
    assertLine(d, inst, `Not enough parameters for ${name} instruction!`)
    if (!s) s = d
		const ops = regToOp(inst, s, 'pc', d)

		return [[
		1, (locations, pos) => {
			return [[(opcode << 9) + ops, inst]]
		}]]
	}
}

function addNilOp(name, opcode) {
	aluOPS[opcode] = name
	insts[name] = (inst) => {
		const ops = regToOp(inst, 'a', 'pc', 'sp')

		return [[
		1, (locations, pos) => {
			return [[(opcode << 9) + ops, inst]]
		}]]
	}
}

// 3 alu fun, 2 carry sel, 1 carry const, 1 negate
// 1 negate, 1 carry const, 2 carry sel, 3 alu fun
addBinOP("add", 0b0011000)
addBinOP("adc", 0b0000000)
addBinOP("ado", 0b0111000)
addBinOP("sub", 0b1111000)
addBinOP("sbb", 0b1100000)
addBinOP("sbz", 0b1011000)
addBinOP("and", 0b0011001)
addBinOP("or",  0b0011010)
addBinOP("xor", 0b0011011)

addUnaOP("swp", 0b0011100)
addUnaOP("shl", 0b0011101)
addUnaOP("shr", 0b0011110)
addUnaOP("rol", 0b0001101)
addUnaOP("ror", 0b0010110)
addUnaOP("inv", 0b0000111)

addNilOp("HLT", 0b0010111)
addNilOp("CRY", 0b0011111)
addNilOp("IE",  0b0100111)
addNilOp("ID",  0b0101111)

insts['not'] = (inst, consts, d, s) => {
	assertLine(d, inst, `Not enough parameters for mov instruction!`)
	if (!s) s = d
	return insts.sbz(inst, consts, d, 'sp', s)
}

// MOV
insts['mov'] = (inst, consts, d, s) => {
	assertLine(s && d, inst, `Not enough parameters for mov instruction!`)
	return insts.add(inst, consts, d, s, 'pc')
}

insts['dw'] = (inst, consts, ...data) => {
	assertLine(data.length, inst, `Not enough parameters for dw instruction!`)

	const string = inst.originalLine.split(/ dw /)[1]
	const values = []

	let inString = false
	let lasts = ''
	string.trim().split('').forEach(char => {
		switch (char) {
			case ',':
				if (inString) {
					values.push(char)
				} else {
					if (lasts.length) values.push(numToOp(inst, lasts))
					lasts = ''
				}
			break;
			case '"':
				inString = !inString
			break;
			default:
				if (inString) {
					values.push(char)
				} else {
					lasts += char
				}
		}
	})

	// last element doesn't need ,
	if (lasts.length) values.push(numToOp(inst, Number(lasts)))

	// subract 1 if last element is a null termination
	const len = values.length - (values[values.length - 1] == 0 ? 1 : 0)
	consts['$-' + inst.name] = len

	return [[
	values.length, (locations, pos) => {
		return values.map((n, i) => {
			const name = i == 0 ? inst.name + ':' : ''

			if (typeof n == 'number') {
				const num = numToOp(inst, parseInt(n))
				return [num, {printLine: `${name} dw ${n}`}]
			}

			const num = numToOp(inst, n.charCodeAt(0))
			return [num, {printLine: `${name} dw '${n}'`}]
		})
	}]]
}

insts['adi'] = (inst, consts, d, s, val) => {
	if (typeof val == 'undefined') {
		val = s
		s = d
	}

	assertLine(d && s, inst, `Not enough parameters for adi instruction!`)

	const ops = regToOp(inst, s, 'ram', d)
	const num = immToOp(inst, val, true)

	return [[
	1, (locations, pos) => {
		return [[(num << 9) + ops, inst]]
	}]]
}

insts['ldi'] = (inst, consts, d, val) => {
	assertLine(d, inst, `Not enough parameters for ldi instruction!`)
	if (val < 64) return insts.adi(inst, consts, d, 'sp', val)
	if (val >= 0xffff - 64) return insts.adi(inst, consts, d, 'sp', val - 0x10000)

	const ops = regToOp(inst, 'ram', 'pc', d)

	return [[
	2, (locations, pos) => {
		const num = numToOp(inst, parseInt(Number(locations[val] || val)))
		const line = ` imm ${num}`
		return [[(0 << 9) + ops, inst], [num, {printLine: line}]]
	}]]
}

insts['lod'] = (inst, consts, d, pos, offset) => {
	assertLine(d && pos, inst, `Not enough parameters for ldi instruction!`)
	assertLine(!offset, inst, `LOD with offset not supported`)

	const ops = regToOp(inst, 'ram', pos, d)

	return [[
	1, (locations, pos) => {
		return [[(0 << 9) + ops, inst]]
	}]]
}

insts['sto'] = (inst, consts, pos, a, offset) => {
	console.log(a, pos, offset);
	assertLine(a && pos, inst, `Not enough parameters for ldi instruction!`)
	assertLine(!offset, inst, `STO with offset not supported`)

	const ops = regToOp(inst, a, pos, 'ram')

	return [[
	1, (locations, pos) => {
		return [[(0 << 9) + ops, inst]]
	}]]
}


insts['sbi'] = (inst, consts, d, s, val) => {
	if (typeof val == 'undefined') {
		val = s
		s = d
	}

	return insts.adi(inst, consts, d, s, -val)
}

export const jmpOPS = {}
function addJMP(name, condition, inverseCondition) {
	jmpOPS[condition] = name

	insts[name] = (inst, consts, name) => {
		assertLine(name, inst, 'No name provided for jump instruction')

		return [[
		1, (locations, pos) => {
			if (name == 'jnx') return false

			const target = locations[name]
			assertLine(typeof target == 'number', inst, 'No jump label: ' + name)

			const dist = target - pos
			const ops = regToOp(inst, 'pc', 'pc', 'pc') + condition << 3

			if (dist >= 64 || dist < -64) return false
			const num = immToOp(inst, dist, true)

			inst.printLine = `${inst.originalLine} (${hex(dist, true)})`
			return [[(num << 9) + ops, inst]]
		}], [
		2, (locations, pos) => {
			if (condition != 7) return false

			const target = locations[name]
			assertLine(typeof target == 'number', inst, 'No jump label: ' + name)

			const ops = regToOp(inst, 'ram', 'pc', 'pc')
			const num = numToOp(inst, target, true)

			const line = {printLine: `${name} (${hex(dist, true)})`}
			return [[(0 << 9) + ops, inst], [num, line]]
		}], [
		3, (locations, pos) => {
			if (typeof inverseCondition != 'number') return false

			const target = locations[name]
			assertLine(typeof target == 'number', inst, 'No jump label: ' + name)

			const ops = regToOp(inst, 'pc', 'pc', 'pc') + inverseCondition
			const JMPOps = regToOp(inst, 'ram', 'pc', 'pc')
			const num = numToOp(inst, target, true)

			const l1 = {printLine: `jmp far`}
			const l2 = {printLine: `${name} (${hex(dist, true)})`}
			return [[3 << 9 + ops, inst], [(0 << 9) + JMPOps, l1], [num, l2]]
		}], [
		4, (locations, pos) => {
			const target = locations[name]
			assertLine(typeof target == 'number', inst, 'No jump label: ' + name)

			const ops = regToOp(inst, 'pc', 'pc', 'pc') + condition
			const IMMops = regToOp(inst, 'pc', 'ram', 'pc')
			const JMPOps = regToOp(inst, 'ram', 'pc', 'pc')
			const num = numToOp(inst, target, true)

			const l1 = {printLine: `skip jmp`}
			const l2 = {printLine: `jmp far`}
			const l3 = {printLine: `${name} (${hex(dist, true)})`}
			return [[(2 << 9) + ops, inst], [(3 << 9) + IMMops, l1], [(0 << 9) + JMPOps, l2], [num, l3]]
		}]]
	}
}

function addJEC(name1, name2, op, aBeforeB, noMinusOne) {
	insts[name1] = insts[name2] = (inst, consts, a, b, name) => {
		assertLine(a && b && name, `Not enough parameters for ${inst.instruction} isntruction`)

		return insts[op](inst, consts, name).map(([len, cb]) => [len + 1, (locations, pos) => {
			const solution = cb(locations, pos + 1)
			if (!solution) return false

			const ops = aBeforeB ? regToOp(inst, a, b, 'sp') : regToOp(inst, b, a, 'sp')
			const opcode = noMinusOne ? 0b1111000 : 0b1011000

			return [(opcode << 9) + ops, inst].concat(solution)
		}])
	}
}

// name(inst, name) => [length, (locations, pos) => [bytes]]
addJMP('jn',  0, 1)
addJMP('jnn', 1, 0)
addJMP('jz',  2, 3)
addJMP('jnz', 3, 2)
addJMP('jc',  4, 5)
addJMP('jnc', 5, 4)
addJMP('jx',  6)	// no inverse condition
addJMP('jnx', 0, 6) // no bnc immediate
addJMP('jmp', 7)

addJEC('jl', 'jnge', 'jc', true, true)
addJEC('jle', 'jng', 'jc', true, false)
addJEC('jg', 'jnle', 'jc', false, true)
addJEC('jge', 'jnl', 'jc', false, false)

addJEC('jb', 'jnae', 'jx', true, true)
addJEC('jbe', 'jna', 'jx', true, false)
addJEC('ja', 'jnbe', 'jx', false, true)
addJEC('jae', 'jnb', 'jx', false, false)

addJEC('je', 'jnd',  'jz', false, false)
addJEC('jne', 'jd', 'jnz', false, false)

insts['ignore'] = inst => [[0, () => [[-1, inst]]]]

insts['.equ'] = (inst, consts, line) => {
	const name = line.match(/(\w+)/)?.[1]

	const value = line.slice(name.length).trim()
	const num = numToOp(inst, Number(value))

	consts[name] = num
	return [[0, () => [[-1, inst]]]]
}
