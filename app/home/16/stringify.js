import {hex} from './assert.js'

export function doublePrint(text) {
	const pageLine = 74
	const p2 = pageLine * 2
	const lineLen = 55
	const separator = ' '

	const out = [''.padStart(lineLen * 2 + 1, ' ')]

	const lines = text.split('\n').slice(0, -1).map(line => {
		return line.slice(0, lineLen).padEnd(lineLen, ' ')
	})

	for (let i = 0; i < lines.length; i++) {
		const page = (i - (i % p2)) / p2
		const y = page * pageLine + (i % pageLine) + page + 1

		if (i % p2 < pageLine) {
			out[y] = lines[i] + separator
		} else {
			out[y] += lines[i]
		}
	}

	const replace = '\n\n'+''.padStart(lineLen * 2, '-')+'\n\n'
	pre.innerHTML += out.join('|\n').replaceAll('\n|\n', replace) + '\n\n\n\n\n\n'


	const print = document.getElementById('print')
	print.innerHTML = ''
	while (out.length) {
		const pre = document.createElement('pre')
		pre.innerHTML = out.splice(0, pageLine + 1).join('\n')

		print.appendChild(pre)
	}
}

export function getPrint(program, noSpace) {
  program = [...program]

	let line = 0
	let output = ''

	while (program.length) {
		const [opcode, inst] = program.shift()

		if (noSpace && !(inst.printLine || inst.originalLine)) continue

		if (opcode == -1) {
			output += ''.padStart(14, ' ')
			// output += ''.padStart(19, ' ')
		} else {
			const code = inst.instruction || ''
			output += `${hex(line++)}: ${hex(opcode)}`
			// output += `${hex(line++)}: ${hex(opcode)} ${code.padEnd(4, ' ')}`
		}
		output += ` | ${inst.printLine || inst.originalLine}\n`
		// output += `| ${inst.printLine || inst.originalLine}\n`
	}

	return output
}

export function getBytes(program) {
  program = [...program]

	let line = 0
	const low = []
	const high = []

	while (program.length) {
		const [opcode, inst] = program.shift()

		if (opcode < 0) continue

		low[line] = (opcode & 255).toString(16).padStart(2, '0')
		high[line] = ((opcode >> 8) & 255).toString(16).padStart(2, '0')
		line++
	}

	return [low.join(','), high.join(',')]
}
