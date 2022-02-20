import {setCurrentLine, assertLine} from '../assert.js'
import {instSet} from './instSet/instSet.js'
import {parsed, assembled, arg} from './parser.js'

interface consts {
  [key: string]: number
}

const consts: consts = {bytePos: 0}

export function setConst(prop: string, val: number) {
  consts[prop] = val
}

export function getConst(index: string): number {
  return consts[index]
}

function constEvaluator(expr: string[], solver: (i: string) => number): number {
  if (expr.length == 1) {
    return solver(expr[0])
  }

  if (expr.length == 3) {
    switch (expr[1]) {
      case '+': return solver(expr[0]) + solver(expr[2])
      case '-': return solver(expr[0]) - solver(expr[2])
      case '*': return solver(expr[0]) * solver(expr[2])
    }
  }

  assertLine(expr.length == 2, 'Not implemented constant propagation')
  return Infinity
}

function walk(source: parsed[], labels: consts, lastPass: boolean): [parsed, number[]][] {
  function resolveArgs(args: arg[]): (string | number)[] {
    return args.map(arg => {
      switch (arg.type) {
        case 'number': return arg.value
        case 'string': return arg.value
        case 'register': return arg.value
        case 'const': {
          const value = constEvaluator(arg.value, str => {
            if (typeof consts[str] == 'number') return consts[str]
            if (typeof labels[str] == 'number') return labels[str]

            assertLine(!lastPass, 'Unresolved symbol')
            return Infinity
          })

          if (lastPass) arg.exec = value
          return value
        }
      }
    })
  }

  const output: [parsed, number[]][] = []

  for (const line of source) {
    setCurrentLine(line)

    if (line.place) {
      labels[line.place] = consts.bytePos
    }

    if (line.type == 'text') {
      output.push([line, []])
      continue
    }

    const {inst, args} = line

    const resolver = instSet[inst]
    assertLine(resolver, 'Unknow instruction')

    const solution = inst != 'equ' ? resolver(...resolveArgs(args)) : resolver(...(args[0].value as string[]))

    consts.bytePos += solution.length
    output.push([line, solution])
  }

  return output
}

export default function assemble(source: parsed[]): assembled[] {

  // first pass => resolve all consts and max program length
  consts.bytePos = 0
  const firstLabels = {}
  walk(source, firstLabels, false)

  // second pass => shorten insts with first pass symbol estimate
  consts.bytePos = 0
  const secondLabels: consts = {}
  walk(source, secondLabels, false)

  // Can a third pass shorten the opcodes even furhter? If it can, not by much

  // resolution pass => correct every opcode with exact symbol => fix-up list
  consts.bytePos = 0
  const walked = walk(source, secondLabels, true)

  const program: assembled[] = []
  let bytePos = 0
  walked.forEach(([src, solutions]: [parsed, number[]]) => {
    if (src.type == 'text') {
      program.push(src)
      return
    }

    if (!solutions.length) {
      const {lineText, lineNumber, comment, place} = src
      program.push({type: 'text', lineText, lineNumber, comment, place})
      return
    }

    solutions.forEach((solution: number, i: number) => {
      const line = JSON.parse(JSON.stringify(src))
      line.bytePos = bytePos
      line.opcode = solution
      line.multiLine = i >= 1

      program.push(line)
      bytePos++
    })
  })

  return program
}