import {assert, assertLine} from './assert.js'
import splitExpr, {prettyPrint} from './parseExpr.js'

const insts = []
insts.consts = {}
function addInst(out, ins, fun, print, recursive = false) {
  print = prettyPrint(print)

  // don't calculate consts
  if (parseFloat(out) || insts.consts[out]) return

  // Recursive expression
  // console.log(out, '=', print, recursive);

  if (out[0] == '(' && !recursive) {
    const expr = out.slice(1, -1).trim()
    let [a, op, b] = splitExpr(expr)

    const [s1, s2, s3] = invertOP(`(${print})`, a, op, b)

    addInst(...s1, true)
    addInst(...s2)
    if (s3) addInst(...s3) // ** and // dont have log

    const sexpr = s1[0].slice(1, -1).trim()
    let [sa, sop, sb] = splitExpr(sexpr)

    // const [sa, sop, sb] = s1[0].slice(1, -1).split(' ')
    addInst(...invertOP(s1[0], sa, sop, sb)[0], true)
    addInst(...invertOP(out, a, op, b)[0], true)
  }

  // deref consts
  ins = ins.map(el => insts.consts[el] || el)

  // remove consts
  const filtered = ins.filter(el => !parseFloat(el))


  const filter = (...args) => {
    return {
      // Read consts to function call
      value: fun(...ins.map(el => parseFloat(el) || args.shift())),
      print
    }
  }

  insts.push({ins: filtered, fun: filter, out, print})
}

const baseLog = (base, num) => Math.log(num) / Math.log(base)

const rootN = (root, n) => Math.pow(n, 1/root)

export default function parse(input) {
  input = input.replaceAll(/[   ]+/g, ' ')

  let lineNumber = 1
  for (let line of input.split('\n')) {
    const info = {lineNumber: lineNumber++, originalLine: line}

    line = line.split(';')[0].trim()
    if (!line.length) continue

    const tokens = line.split(' ')

    let [d, eq, a, op, b, is, desc] = tokens

    if (eq == 'as') {
      insts[d] = [a, b, desc] // as, in
      continue
    }

    if (eq == 'of') {
      assertLine(info, a && b && parseFloat(b), 'Invalid of')

      if (!insts[d].consts) insts[d].consts = {}

      insts[d].consts[a] = parseFloat(b)
      continue
    }

    if (eq == 'is') {
      insts.consts[d] = a
      continue
    }

    const expr = line.match(/.*? = (.*)/)[1]
    ;[a, op, b] = splitExpr(expr)

    assertLine(info, eq == '=', 'Expected = but got: ' + eq)

    invertOP(d, a, op, b).forEach(inv => addInst(...inv))
  }

  return insts
}

function invertOP(d, a, op, b) {
  const out = []
  const fun = (...args) => out.push(args)

  if (!op) {
    fun(d, [a], (a) => a, `${a}`) // d = a
    fun(a, [d], (d) => d, `${d}`) // a = d
  } else if (op == '+') {
    fun(d, [a, b], (a, b) => a + b, `${a} + ${b}`) // d = a + b
    fun(a, [d, b], (d, b) => d - b, `${d} - ${b}`) // a = d - b
    fun(b, [d, a], (d, a) => d - a, `${d} - ${a}`) // b = d - a
  } else if (op == '-') {
    fun(d, [a, b], (a, b) => a - b, `${a} - ${b}`) // d = a - b
    fun(a, [d, b], (d, b) => d + b, `${d} + ${b}`) // a = d + b
    fun(b, [a, d], (a, d) => a - d, `${a} - ${d}`) // b = a - d
  } else if (op == '*') {
    fun(d, [a, b], (a, b) => a * b, `${a} * ${b}`) // d = a * b
    fun(a, [d, b], (d, b) => d / b, `${d} / ${b}`) // a = d / b
    fun(b, [a, d], (a, d) => d / a, `${d} / ${a}`) // b = d / a
  } else if (op == '/') {
    fun(d, [a, b], (a, b) => a / b, `${a} / ${b}`) // d = a / b
    fun(a, [d, b], (d, b) => d * b, `${d} * ${b}`) // a = d * b
    fun(b, [a, d], (a, d) => a / d, `${a} / ${d}`) // b = a / d
  } else if (op == '**') {
    fun(d, [a, b], (a, b) => a ** b, `${a} ** ${b}`) // d = a ** b
    fun(a, [d, b], (d, b) => rootN(b, d), `${d} \/\/ ${b}`) // a = d // b
    // fun(b, [a, d], (a, d) => a / d, `${a} / ${d}`) // b = a / d
  } else {
    console.log('Unknown op: ' + op)
  }

  return out
}
