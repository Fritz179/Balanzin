const input = `

; Corente Basi
  U as Tensione in V is Volt
  R as Resistenza in Ω is Ohm
  L as Leithfehigkeit in boh is boh
  I as Corrente in A is Ampere
  P as Potenza in W is Watt
  W as Consumo in kWh is Kilo_Watt_Hour
  T as Tempo in s is Secondi
  ;R as Resistenza in <ohmega> is Ohm or Ω

  R of Rame is 0.0175

  ;L = 1 / R
  U = R * I
  P = U * I
  W = P * T

; Roh ρ

  ρ as Resistività in Ω*mm2/m is rho
  l as Lunghezza in m is metri

  R = ((ρ * l) / A) / 1000000

; Mate base
  π as Pi in - is -
  r as Raggio in m is metri
  d as Diametro in m is metri
  r2 as Raggio2 in m is metri_qudri
  A as Area in m2 is metri_qudri
  p as Perimetro in m is metri

  π is 3.14159265358979323

  p = d * π
  d = r * 2
  r2 = r ** 2
  A = r2 * π

; Trigonometria
  a as Cateto in m is metri
  b as Cateto in m is metri
  c as Ipotenusa in m is metri

  a2 as Cateto2 in m2 is metri_qudri
  b2 as Cateto2 in m2 is metri_qudri
  c2 as Ipotenusa2 in m2 is metri_qudri

  a2 = a ** 2
  b2 = b ** 2
  c2 = c ** 2
  c2 = a2 + b2

`

function assert(condition, message) {
  if (!condition) console.log(message)
}

function assertLine(info, condition, message) {
  if (!condition) console.log(`${message}\n  at line: ${info.lineNumber}: ${info.originalLine}`)
}

const insts = []
insts.consts = {}
function addInst(out, ins, fun, print, recursive = false) {

  // don't calculate consts
  if (parseFloat(out) || insts.consts[out]) return

  // Recursive expression
  console.log(out, '=', print, recursive);
  if (out[0] == '(' && !recursive) {
    const expr = out.slice(1, -1).trim()
    let [a, op, b] = expr.split(' ')

    if (expr.match(/(\(.*\))/)) {
      a = expr.match(/(\(.*\))/)[1]
      rest = expr.slice(a.length).trim();
      [op, b] = rest.split(' ')
    }

    const [s1, s2, s3] = invertOP(`(${print})`, a, op, b)
    addInst(...s1, true)
    addInst(...s2)
    addInst(...s3)

    const sexpr = s1[0].slice(1, -1).trim()
    let [sa, sop, sb] = sexpr.split(' ')

    if (sexpr.match(/(\(.*\))/)) {
      sa = sexpr.match(/(\(.*\))/)[1]
      srest = sexpr.slice(sa.length).trim();
      [sop, sb] = srest.split(' ')
    }
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

function parse(input) {
  let lineNumber = 1
  for (line of input.split('\n')) {
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
    if (expr[0] == '(') {
      a = expr.match(/(\(.*\))/)[1]
      const rest = expr.slice(a.length).trim();
      [op, b] = rest.split(' ')
    }

    assertLine(info, eq == '=', 'Expected = but got: ' + eq)

    invertOP(d, a, op, b).forEach(inv => addInst(...inv))
  }
}

function invertOP(d, a, op, b) {
  const out = []
  const fun = (...args) => out.push(args)

  if (op == '+') {
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

function find(given) {
  const knowns = JSON.parse(JSON.stringify(given))

  let lastLen = Object.keys(knowns).length - 1

  while (lastLen != Object.keys(knowns).length) {
    lastLen = Object.keys(knowns).length

    for (inst of insts) {
      if (knowns[inst.out]) continue
      if (inst.ins.some(el => !knowns[el])) continue

      knowns[inst.out] = inst.fun(...inst.ins.map(el => knowns[el].value))
    }
  }

  return knowns
}

function printInst() {
  const list = {}

  insts.forEach(inst => {
    if (list[inst.out]) {
      list[inst.out].push(inst)
    } else {
      list[inst.out] = [inst]
    }
  })

  let out = []
  for (res in list) {

    // intermidiary
    if (res[0] == '(') continue

    assert(insts[res], 'key as name un unit of: ' + res)
    let [name, unit, nameIn] = insts[res]
    nameIn = nameIn ? `[${nameIn}]` : ''

    let line = `${name}`.padEnd(20, ' ')
    line += `${res}[${unit}]`
    line = line.padEnd(30, ' ') + ' = '

    for (let pos of list[res]) {
      line += pos.print + ' = '
    }

    line = line.slice(0, -3)

    out.push(line)
  }

  document.getElementById('pre').innerHTML = out.join('\n')
}

parse(input)
console.log(insts)
printInst()

const given = {}

function calc() {
  const unit = document.getElementById('unit')
  const value = document.getElementById('value')
  const num = value.value.indexOf('(') != -1 ? value.value.match(/\((.*?)\)/)[1] : value.value

  if (unit.value && num && parseFloat(num)) {
    if (!insts[unit.value]) return alert('Bad data')

    given[unit.value] = {value: parseFloat(num), print: 'Dato'}
    unit.value = ''
    value.value = ''
  }

  const result = find(given)
  console.log(result);

  const div = document.getElementById('result')
  div.innerHTML = ''

  function getLine(key) {
    if (key[0] == '(') return ''

    const [_, name, desc] = insts[key]
    const val = prefix(result[key].value)
    return `${key} = ${val}${name}[${desc}]`.padEnd(30) + `=> ${result[key].print}\n`
  }

  for (key in given) {
    div.innerHTML += getLine(key)
  }

  for (key in result) {
    if (given[key]) continue
    div.innerHTML += getLine(key)
  }
}

const SISteps = [
  [[1000, 'k'], [1000, 'M'], [1000, 'G'], [1000, 'T'], [1000, 'P'], [1000, 'E'], [1000, 'Z'], [1000, 'Y']],
  [[1000, 'm'], [1000, 'μ'], [1000, 'n'], [1000, 'p'], [1000, 'f'], [1000, 'a'], [1000, 'z'], [1000, 'y']]
]

function prefix(unit) {
  const sign = unit < 0 ? -1 : 1
  const r = () => (sign * unit).toString().match(/(-?\d*(\.\d\d\d)?)/)[1]

  if (unit == 0) return r()
  unit *= sign


  if (unit < 1) {
    const vals = SISteps[1]
    let i = 0

    while (unit < 1 && i < vals.length - 1) unit *= vals[i++][0]

    console.log(unit, vals, i);
    return `${unit >= 1 ? r() : unit} ${vals[i][1]}`
  }

  const vals = SISteps[0]
  let i = -1

  while (i < vals.length - 1 && unit >= vals[i + 1][0]) unit /= vals[++i][0]

  return `${r()} ${i == -1 ? ' ' : vals[i][1]}`
}

function load() {
  const added = {}
  const list = document.getElementById('unitList')

  // add possible units
  for (unit of insts) {
    if (unit.out[0] == '(') continue
    if (added[unit.out]) continue
    added[unit.out] = true
    list.innerHTML += `<option value="${unit.out}">`
  }

  // suggest constants
  const inp = document.getElementById('unit')
  const value = document.getElementById('valueList')
  inp.onchange = () => {
    const val = inp.value
    const consts = insts[val]?.consts
    value.innerHTML = ''

    if (!consts) return

    for (key in consts) {
      if (key[0] == '(') continue
      value.innerHTML += `<option value="${key} (${consts[key]})">`
    }
  }

}

window.addEventListener('load', load)
