import {assertRegisters, assertImmediate} from './assert.js'
import {getBytePos} from './compile.js'

const instSet = {}
export default instSet

function addOP(name, op) {
  instSet[name] = op
}

function binOP(name, opcode) {
	addOP(name, (d, a, b) => {
    if (!b) b = d

		const registers = assertRegisters(a, b, d)
		return [(opcode << 9) + registers]
	})
}

function nilOP(name, opcode) {
  addOP(name, () => {
		const registers = assertRegisters('a', 'pc', 'sp')
		return [(opcode << 9) + registers]
	})
}

binOP('add', 0b0011000)
binOP("sub", 0b1111000)

nilOP("HLT", 0b0010111)

addOP('adi', (d, a, val) => {
	if (typeof val == 'undefined') {
		val = a
		a = d
	}

  const registers = assertRegisters(a, 'ram', d)
  const immediate = assertImmediate(val)
  return [(immediate << 9) | registers]
})

addOP('ldi', (d, val) => {
  return instSet.adi(d, 'sp', val)
})

// insts['ldi'] = (inst, consts, d, val) => {
// 	assertLine(d, inst, `Not enough parameters for ldi instruction!`)
//
// 	const num = Number(val)
//
// 	if (typeof num == 'number') {
// 		if (val < 64) return insts.adi(inst, consts, d, 'sp', val)
// 		if (val >= 0xffff - 64) return insts.adi(inst, consts, d, 'sp', val - 0x10000)
// 	}
//
// 	const ops = regToOp(inst, 'pc', 'pc', d)
// 	console.log(d, val);
// 	assert(false, 'Not implemented')
// 	return [[
// 	3, (locations, pos) => {
// 		const num = numToOp(inst, parseInt(Number(locations[val] ?? val)))
// 		const line = ''.padStart(12, ' ') + `imm ${hex(num)}`
//
// 		const jmp = regToOp(inst, 'pc', 'pc', 'pc') + (7 << 3) + (1 << 9)
// 		return [
// 			[(1 << 9) + ops, inst],
// 			[jmp, {printLine: 'skip imm'}],
// 			[num, {printLine: line}]
// 		]
// 	}]]
// }

addOP('lod', (d, pos, offset = 0) => {
  const registers = assertRegisters('ram', pos, d)
  const immediate = assertImmediate(offset)

  return [(immediate << 9) | registers]
})

addOP('sto', (pos, a, offset = 0) => {
  const registers = assertRegisters(a, pos, 'ram')
  const immediate = assertImmediate(offset)

  return [(immediate << 9) | registers]
})

// insts['lod'] = (inst, consts, d, pos, offset = 0) => {
// 	assertLine(d && pos, inst, `Not enough parameters for ldi instruction!`)
// 	// assertLine(!offset, inst, `LOD with offset not supported`)
//
// 	const ops = regToOp(inst, 'ram', pos, d)
// 	return [[
// 	1, (locations, pos) => {
// 		const off = numToOp(inst, parseInt(Number(locations[offset] ?? offset)))
// 		console.log(off);
// 		return [[(off << 9) + ops, inst]]
// 	}]]
// }

addOP('mov', (d, a) => instSet.add(d, a, 'pc'))

addOP('jmp', (to) => {
  const here = getBytePos()
  const diff = to - here

  return instSet.adi('pc', diff)
})

addOP('jc', (to) => {
  const here = getBytePos()
  const diff = to - here

  const registers = assertRegisters('sp', 'di', 'pc')
  const immediate = assertImmediate(diff)
  console.log(immediate, diff, to);
  return [(immediate << 9) | registers]
})

// function addJMP(name, condition, inverseCondition) {
// 	jmpOPS[condition] = name
//
// 	insts[name] = (inst, consts, name) => {
// 		assertLine(name, inst, 'No name provided for jump instruction')
//
// 		return [[
// 		1, (locations, pos) => {
// 			if (name == 'jnx') return false
//
// 			const target = locations[name] - 1
// 			assertLine(typeof target == 'number', inst, 'No jump label: ' + name)
//
// 			const dist = target - pos
// 			const ops = regToOp(inst, 'pc', 'pc', 'pc') + condition << 3
//
// 			if (dist >= 64 || dist < -64) return false
// 			const num = immToOp(inst, dist, true)
//
// 			inst.printLine = `${inst.originalLine} (${hex(dist, true)})`
// 			return [[(num << 9) + ops, inst]]
// 		}], [
// 		2, (locations, pos) => {
// 			if (condition != 7) return false
//
// 			const target = locations[name]
// 			assertLine(typeof target == 'number', inst, 'No jump label: ' + name)
//
// 			const ops = regToOp(inst, 'ram', 'pc', 'pc')
// 			const num = numToOp(inst, target, true)
//
// 			const line = {printLine: `${name} (${hex(target - pos, true)})`}
// 			return [[(0 << 9) + ops, inst], [num, line]]
// 		}], [
// 		3, (locations, pos) => {
// 			if (typeof inverseCondition != 'number') return false
//
// 			const target = locations[name]
// 			assertLine(typeof target == 'number', inst, 'No jump label: ' + name)
//
// 			const ops = regToOp(inst, 'pc', 'pc', 'pc') + inverseCondition
// 			const JMPOps = regToOp(inst, 'ram', 'pc', 'pc')
// 			const num = numToOp(inst, target, true)
//
// 			const l1 = {printLine: `jmp far`}
// 			const l2 = {printLine: `${name} (${hex(target - pos, true)})`}
// 			return [[3 << 9 + ops, inst], [(0 << 9) + JMPOps, l1], [num, l2]]
// 		}], [
// 		4, (locations, pos) => {
// 			const target = locations[name]
// 			assertLine(typeof target == 'number', inst, 'No jump label: ' + name)
//
// 			const ops = regToOp(inst, 'pc', 'pc', 'pc') + condition
// 			const IMMops = regToOp(inst, 'pc', 'ram', 'pc')
// 			const JMPOps = regToOp(inst, 'ram', 'pc', 'pc')
// 			const num = numToOp(inst, target, true)
//
// 			const l1 = {printLine: `skip jmp`}
// 			const l2 = {printLine: `jmp far`}
// 			const l3 = {printLine: `${name} (${hex(dist, true)})`}
// 			return [[(2 << 9) + ops, inst], [(3 << 9) + IMMops, l1], [(0 << 9) + JMPOps, l2], [num, l3]]
// 		}]]
// 	}
// }
//
// // name(inst, name) => [length, (locations, pos) => [bytes]]
// addJMP('jn',  0, 1)
// addJMP('jnn', 1, 0)
// addJMP('jz',  2, 3)
// addJMP('jnz', 3, 2)
// addJMP('jc',  4, 5)
// addJMP('jnc', 5, 4)
// addJMP('jx',  6)	// no inverse condition
// addJMP('jnx', 0, 6) // no bnc immediate
// addJMP('jmp', 7)