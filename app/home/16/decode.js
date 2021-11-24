import {aluOPS, jmpOPS} from './insts.js'
import {hex} from './assert.js'

const REGS = ['pc', 'sp', 'si', 'di', 'a', 'b', 'c', 'ram']
export default function decode(words, solutions) {
	words = [...words]
	solutions = [...solutions]

	let out = ''
	let pos = -1
	while (words.length) {
		const word = words.shift()
		const sol = solutions.shift().trim().match(/^(.*?)(;.*|$)/)[1].trim().toLowerCase()

		pos++

    if (sol.match(/(.*?:)?dw/) || sol.slice(0, 3) == 'imm') {
      out += `${''.padEnd(15, ' ')} | ${sol}\n`
      continue
    }

    let inst = opToInst(pos, word, words[0])

		const norm = str => str.replaceAll(/(0x\d+|0b\d+|\d+)/g, n => '0x' + Number(n).toString(16))

    let separator = '|'
		if (!inst || norm(inst) != norm(sol)) {
      console.log(`Expected: "${word}", to be: "${sol}", but got: "${inst}"`);
      separator = '#'
		}

		if (!inst) inst = hex(word)

		out += `${inst.padEnd(15, ' ')} ${separator} ${sol}\n`
	}

	return out
}

export function opToInst(pos, word, next, extended = false) {
  const a = REGS[(word >> 0) & 7]
  const b = REGS[(word >> 3) & 7]
  const d = REGS[(word >> 6) & 7]

  const opcode = (word >> 9)
  const unsigned = hex(opcode)
  const signed = opcode < 64 ? unsigned : '0x' + (65535 + 64 - opcode).toString(16)
  // 65 = -1
  // 127 = -63
  let inst

  if (a == 'pc' && d == 'pc') {
    const cond = (word >> 3) & 7
    const jmpType = jmpOPS[cond]
    const dest = pos + (opcode >= 64 ? opcode - 128 : opcode)
    inst = `${jmpType} ${hex(dest)}`
  } else if (b == 'ram') {
    if (a == 'sp') {
      if (d == 'pc' && !extended) {
        inst = `jmp ${hex(opcode + pos)}`
      } else  {
        inst = `ldi ${d}, ${signed}`
      }
    } else {
      if (opcode >= 64) {
        inst = `sbi ${a}, ${hex(opcode - 63)}`
      } else {
        inst = `adi ${a}, ${unsigned}`
      }
    }
  } else if (a == 'ram') {
    if (b == 'pc') {
      const val = hex(next)
			if (!extended) {
				inst = `ldi ${d}, ${val}`
			} else {
				// LOD with PC point one ahead of current instruction
				inst = `lod ${d}, ${hex((opcode < 0 ? 64 - opcode : opcode) + pos + 1)}`
			}
    }
  } else if (d == 'ram') {
		inst = `sto ${b}, ${a}`
  } else {
    let aluOp = aluOPS[opcode]

    if (aluOp) {
      aluOp = aluOp.padEnd(3, ' ')

      if (a == 'sp' && aluOp == 'sbz') {
          inst = `not ${b}`
      } else if (b == 'pc') {
        if (aluOp == 'add') {
          inst = `mov ${d}, ${a}`
        }	else if (a == d && !extended) {
          inst = `${aluOp} ${a}`
        } else {
          inst = `${aluOp} ${a}, ${d}`
        }
      } else {
        if (b == d && !extended) {
          inst = `${aluOp} ${b}, ${a}`
        } else {
          inst = `${aluOp} ${d}, ${a}, ${b}`
        }
      }
    }
  }

	if (!inst) console.log('Unhadled inst');
	// console.log(a, b, d, opcode, pos);
  return inst
}
