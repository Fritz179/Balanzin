import {assertRegisters, assertImmediate} from '../../assert.js'
import {addOP, instSet} from './instSet.js'
import {memory as m, setFlags} from '../../run.js'

type binFun = (a: number, b: number) => number
function binOP(name: string, opcode: number, exec: binFun) {
	addOP(name, (d, a, b) => {
    if (!b) b = d

		const registers = assertRegisters(a, b, d)
		return [(opcode << 9) + registers]
	},
		(d, a, b) => {
			const aBus = m[b ? a : d]
			const bBus = m[b ? b : a]
			const dBus = exec(aBus, bBus)

			m[d] = setFlags(aBus, bBus, dBus)
		}
	)
}

function nilOP(name: string, opcode: number) {
  addOP(name, () => {
		const registers = assertRegisters('a', 'pc', 'sp')
		return [(opcode << 9) + registers]
	}, () => { })
}

binOP('add', 0b0011000, (a, b) => a + b)
binOP("sub", 0b1111000, (a, b) => a - b)
binOP('and', 0b0011001, (a, b) => a & b)

nilOP("HLT", 0b0010111)

addOP('adi', (d, a, val) => {
	if (typeof val == 'undefined') {
		val = a
		a = d
	}

  const registers = assertRegisters(a, 'ram', d)
  const immediate = assertImmediate(val)
  return [(immediate << 9) | registers]
}, (d, a, val) => {
	if (typeof val == 'undefined') {
		val = a
		a = d
	}

	const aBus = m[a]
	const bBus = val as number
	const dBus = aBus + bBus

	m[d] = setFlags(aBus, bBus, dBus)
})

addOP('inc', (d) => instSet.adi(d, d, 1), (d) => setFlags(m[d], 0, m[d]++))
addOP('dec', (d) => instSet.adi(d, d, -1), (d) => setFlags(m[d], 0, m[d]--))