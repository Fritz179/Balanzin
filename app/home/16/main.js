import {compile, parse} from './parse.js'
import assert from './assert.js'
import decode from './decode.js'
import {getPrint, getBytes} from './stringify.js'
import simulate from './simulate.js'

let low, high
let simCode, simFrom, symLoc
function copySource(isHigh) {
	startParse()

	const bytes = isHigh ? high : low
	navigator.clipboard.writeText(bytes.replaceAll('\n', ''))
}

function startParse() {
	const source = document.getElementById('source').value.replaceAll('\t', '  ')
	const pre = document.getElementById('pre')
	const print = document.getElementById('print')
	try {
		assert(source.length, 'Error: No input source')

		const instructions = parse(source)
		const {locations, solution} = compile(instructions)
		console.log(locations);

		const printable = getPrint(solution)
		pre.innerHTML = printable
		print.innerHTML = printable

		;[low, high] = getBytes(solution)

		const filtered = solution.filter(el => el[0] >= 0)
		const encoded = filtered.map(el => el[0])
		const original = filtered.map(el => el[1].originalLine || el[1].printLine)
		const decoded = decode(encoded, original)
		// pre.innerHTML = decoded

		const encodedFrom = filtered.map(el => el[1])
		simCode = encoded
		simFrom = encodedFrom
		symLoc = locations
	} catch (e) {
		console.warn(e)
		pre.innerHTML = e
	}

}

function startSimulation() {
	startParse()

	simulate(simCode, simFrom, symLoc)
}

function main() {
	document.getElementById('low').onclick = () => copySource(false)
	document.getElementById('high').onclick = () => copySource(true)
	document.getElementById('parse').onclick = () => startParse(false)
	document.getElementById('simulate').onclick = () => startSimulation()

	// startParse()
	startSimulation()
}

window.addEventListener('load', main)
