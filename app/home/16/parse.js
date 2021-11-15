import assert, {assertLine} from './assert.js'
import {insts} from './insts.js'

export function compile(instructions, locations = {}, bytePos = 0) {
	if (!instructions.length) {
		return {locations, solution: []}
	}

	const inst = instructions.shift()

	// If it is labelled
	if (inst.name) {
		locations[inst.name] = bytePos
	}

	// get resolver
	const resolver = insts[inst.instruction]
	assertLine(resolver, inst, `Unknown instruction: "${inst.instruction}"`)

	const solutions = resolver(inst, locations, ...inst.args)

	while (solutions.length) {
		const [len, cb] = solutions.shift()
		const thisLocations = JSON.parse(JSON.stringify(locations))

		// try the rest with this opcode length
		const possible = compile([...instructions], thisLocations, bytePos + len)
		if (!possible) continue

		// try to fit this opcode in this length
		const pre = cb(possible.locations, bytePos)
		if (!pre) continue

		// It fits! add to sulution
		possible.solution = pre.concat(possible.solution)

		return possible
	}

	assert(false, 'unreachable!')
	return false
}


export function parse(sourcode) {
	const lines = sourcode.split('\n')
  const consts = {}

	let lineNumber = 0
	const result = []

	while (lines.length) {
		const originalLine = lines.shift()
		lineNumber++

		let line = originalLine.trim().match(/^(.*?)(;.*|$)/)?.[1]?.trim().replaceAll(',', ' ')

		if (!line.length) {
			result.push({name: '', lineNumber, originalLine, instruction: "ignore", args: []})
			continue
		}

		const name = line.match(/(\w+):/)?.[1]
		if (name) {
			line = line.slice(name.length + 1).trim()

			if (!line.length) {
				result.push({name, lineNumber, originalLine, instruction: "ignore", args: []})
				continue
			}
		}

		const directive = line.match(/(\.\w+)/)?.[1]
		if (directive) {
			line = line.slice(directive.length).trim()

			result.push({name, lineNumber, originalLine, instruction: directive, args: [line]})
			continue
		}

		const instruction = line.match(/(\w+)/)?.[1]
		line = line.slice(instruction.length).trim()
		assert(instruction?.length, 'No instruction?')

		const args = []
		while (line.length) {
			const arg = line.match(/(\w+)/)?.[1]
			assert(arg?.length, 'No arg?')
			line = line.slice(arg.length).trim()
			args.push(arg.trim())
		}

		result.push({name, lineNumber, originalLine, instruction, args})
	}

	return result
}
