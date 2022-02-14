import {assertRegisters, assertImmediate} from '../../assert.js'
import {addOP, instSet} from '../instSet.js'

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

addOP('inc', (d) => instSet.adi(d, d, 1), (m, d) => m[d]++)