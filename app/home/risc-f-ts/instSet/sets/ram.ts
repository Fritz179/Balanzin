import {assertRegisters, assertImmediate} from '../../assert.js'
import {addOP, instSet} from '../instSet.js'
import {memory as m} from '../../run.js'

addOP('ldi',
  (d, val) => instSet.adi(d, 'sp', val),
  (d, val) => m[d] = val as number
)

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
}, (d, pos, offset = 0) => {
  // @ts-ignore
  m[d] = m[(pos + offset) & 65535]
})

addOP('sto', (pos, a, offset = 0) => {
  const registers = assertRegisters(a, pos, 'ram')
  const immediate = assertImmediate(offset)

  return [(immediate << 9) | registers]
}, (pos, a, offset = 0) => {
  // @ts-ignore
  m[(pos + offset) & 65535] = m[a]
})

addOP('mov', (d, a) => instSet.add(d, a, 'pc'), (d, a) => m[d] = m[a])