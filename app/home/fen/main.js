import {assert, assertLine} from './assert.js'
import resolve, {prefix} from './resolve.js'
import parse from './parse.js'

const input = `

; Α α, Β β, Γ γ, Δ δ, Ε ε, Ζ ζ, Η η, Θ θ, Ι ι, Κ κ, Λ λ, Μ μ, Ν ν, Ξ ξ, Ο ο, Π  π, Ρ ρ, Σ σ/ς, Τ τ, Υ υ, Φ φ, Χ χ, Ψ ψ, Ω ω.

; Corente Basi
  U as Tensione in          V is Volt
  R as Resistenza in        Ω is Ohm
  Y as Conduttività in      S is Siemens
  I as Corrente in          A is Ampere
  S as Potenza_apparente in W,VA is Watt,Volt*Ampere
  P as Potenza_attiva in    W is Watt
  Q as Potenza_reattiva in  W,var is Watt,Var
  Pη as Potenza_resa in     W is Watt
  t as Tempo in             s is Secondi
  E as Energia in           J,Ws is Joule,Watt*Secondi
  η as Rendimento in        n is -
  cosφ as Sfasamento in     ° is gradi
  n_spire as numero_spire in - is -
  Θ as Forza_magnetomotrice in A_spire is Ampere_spire
  Η as Intensità_campo_magnetico in A/m is Amprete/metri
  Β as Densità_flusso_magnetico in T is Tesla
  Φ as Flusso_magnetico in W is Weber
  μ as Permeabilità_assoluta in Tm/A is Tesla*metro/SAmpere
  μ0 as Permeabilità_vuoto in Tm/a is Tesla*metro/Ampere
  μr as Permeabilità_relativa in - is -
  μ0 is 0.000001256637061

  Θ = n_spire * I
  μ = μ0 * μr
  Β = μ * Η
  Η = Θ / l
  Φ = Β * A

  n_spire = 1.648 k-[-]         => Dato
  l = 165 mm[metri]             => Dato
  R = 583  Ω[Ohm]               => Dato
  U = 35  V[Volt]               => Dato
  Β = 400 mT[Tesla]             => Dato

  μr of Aria is 1
  μr of Ferro_dolce is 10000
  μr of Ferro_Silicio is 20000
  μr of Ferro_Nichel is 90000

  Y = 1 / R
  U = R * I
  E = P * t
  S = U * I
  P = S * cosφ
  Q = (S ** 2 - P ** 2) // 2

  cosφ of Resistenza is 1
  cosφ of Condesatore is 0
  cosφ of Induttore is 0


  a as Accelerazione in m/s2 is metri/secondo_quadri
  g as Gravità in m/s2 is metri/secondo_quadri
  a = g

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

    let line = `${name}`.padEnd(26, ' ')
    line += `${res}[${unit}]`
    line = line.padEnd(36, ' ') + ' = '

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
    return `${key} = ${val}${name}[${desc}]`.padEnd(36) + ` => ${result[key].print}\n`
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
