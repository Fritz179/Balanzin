import {assertRegisters, assertImmediate} from '../../assert.js'
import {addOP, instSet} from '../instSet.js'
import {getBytePos} from '../../compile.js'

function addJMP(name, cond) {
  addOP(name, (to) => {
    const here = getBytePos()
    const diff = to - here

    const registers = assertRegisters('pc', cond, 'pc')
    const immediate = assertImmediate(diff)

    return [(immediate << 9) | registers]
  })
}

addJMP('jc', 'di')
addJMP('jnc', 'a')
addJMP('jmp', 'ram')

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