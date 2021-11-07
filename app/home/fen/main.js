import {assert, assertLine} from './assert.js'
import resolve, {prefix} from './resolve.js'
import parse from './parse.js'

const input = `

; Corente Basi
  U as Tensione in      V is Volt
  R as Resistenza in    Ω is Ohm
  G as Conduttività in  ℧ is Siemens
  I as Corrente in      A is Ampere
  P as Potenza in       W is Watt
  t as Tempo in         s is Secondi
  E as Energia in       J,Ws is Joule,Watt_Secondi

  a as Accelerazione in m/s2 is metri/secondo_quadri
  g as Gravità in m/s2 is metri/secondo_quadri

  g of Tera is 9.807
  g of Lüna is 1.62
  g of Sole is 274
  g of Marte is 3.71
  g of Giove is 24.71
  g of Saturno is 10.44
  g of Mercurio is 3.7
  g of Urano is 8.87
  g of Nettuno is 11.15
  g of Pluto is 0.62
  g of stella_nana is 3432450
  g of stella_neutroni is 2000000000000
  g of buco_nero is Infinity

  a = g
  G = 1 / R
  U = R * I
  P = U * I
  E = P * t

; Roh ρ

  ρ as Resistività in Ω*mm2/m is rho
  l as Lunghezza in m is metri
  s as Strada in m is metri

  l = s

  ρ of Rame is 0.0175
  ρ of Costantana is 0.5

  R = ρ * l / (A * 1000000)

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
  A = r ** 2 * π

; Trigonometria
  aΔ as Cateto in m is metri
  bΔ as Cateto in m is metri
  cΔ as Ipotenusa in m is metri
`

const insts = parse(input)
console.log(insts);

function printInst() {
  const list = {}

  insts.forEach(inst => {
    if (list[inst.out]) {
      list[inst.out].push(inst)
    } else {
      list[inst.out] = [inst]
    }
  })

  const out = []
  for (const res in list) {

    if (res[0] == '(') continue

    assert(insts[res], 'Missing definition of: ' + res)
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

const given = {}
function addUnit() {
  const unit = document.getElementById('unit')
  const value = document.getElementById('value')
  const num = value.value.indexOf('(') != -1 ? value.value.match(/\((.*?)\)/)[1] : value.value

  if (unit.value && num && parseFloat(num)) {
    if (!insts[unit.value]) return alert('Bad data')

    given[unit.value] = {value: parseFloat(num), print: 'Dato'}
    unit.value = ''
    value.value = ''
  }

  const result = resolve(given, insts)

  const div = document.getElementById('result')
  div.innerHTML = ''

  function getLine(key) {
    if (key[0] == '(') return ''

    const [_, name, desc] = insts[key]
    const val = prefix(result[key].value)
    return `${key} = ${val}${name}[${desc}]`.padEnd(30) + `=> ${result[key].print}\n`
  }

  for (const key in given) {
    div.innerHTML += getLine(key)
  }

  for (const key in result) {
    if (given[key]) continue
    div.innerHTML += getLine(key)
  }
}

function load() {
  document.getElementById('calculate').onclick = addUnit


  const added = {}
  const list = document.getElementById('unitList')

  // add possible units
  for (const unit of insts) {
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

    for (const key in consts) {
      if (key[0] == '(') continue
      value.innerHTML += `<option value="${key} (${consts[key]})">`
    }
  }
}

printInst()
window.addEventListener('load', load)
