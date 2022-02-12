import {setCurrentLine, assertUnreachable} from './assert.js'
import instSet from './instSet.js'

function resolveLine(line, consts, places) {
  const {inst, args} = line
  if (!inst) return []

  setCurrentLine(line)

  const vals = args.map(arg => {
    if (arg.type == 'char') return arg.value
    if (arg.type == 'number') return arg.value
    if (arg.type == 'keyword') return arg.value

    if (arg.type == 'const') {
      if (typeof consts[arg.value] == 'number') return consts[arg.value]
      if (typeof places[arg.value] == 'number') return places[arg.value]
      return Infinity
    }

    console.log('asdfasdf');
  })

  return instSet[inst](...vals)
}

let bytePos = 0
export function getBytePos() {
  return bytePos
}

export default function compile(source) {
  const consts = {}
  bytePos = 0

  // first pass => resolve all consts and max program length
  const firstPassPlaces = {}
  for (const line of source) {
    if (line.place) firstPassPlaces[line.place] = bytePos

    const solution = resolveLine(line, consts, firstPassPlaces)
    bytePos += solution.length
  }

  // second pass => shorten insts with first pass symbol estimate
  bytePos = 0
  const secondPassPlaces = {}
  for (const line of source) {
    if (line.place) secondPassPlaces[line.place] = bytePos

    const solution = resolveLine(line, consts, firstPassPlaces)
    bytePos += solution.length
  }

  // Can a third pass shorten the opcodes even furhter? If it can, not by much

  // resolution pass => correct every opcode with exact symbol => fix-up list
  bytePos = 0
  const program = []
  for (const src of source) {
    const solution = resolveLine(src, consts, secondPassPlaces)

    if (!solution.length) {
      program.push(src)
      continue
    }

    solution.forEach((sol, i) => {
      const line = JSON.parse(JSON.stringify(src))
      line.bytePos = bytePos
      line.opcode = sol
      line.multiLine = i >= 1

      program.push(line)
      bytePos++
    })
  }

  return program
}