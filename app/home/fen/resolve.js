const SISteps = [
  [[1000, 'k'], [1000, 'M'], [1000, 'G'], [1000, 'T'], [1000, 'P'], [1000, 'E'], [1000, 'Z'], [1000, 'Y']],
  [[1000, 'm'], [1000, 'μ'], [1000, 'n'], [1000, 'p'], [1000, 'f'], [1000, 'a'], [1000, 'z'], [1000, 'y']]
]

window.prefix = prefix
export function prefix(unit) {
  const sign = unit < 0 ? -1 : 1
  const r = () => (sign * unit).toString().match(/(-?\d*(\.\d\d\d)?)/)[1]

  if (unit == 0) return r()
  if (!Number.isFinite(unit)) return 'Infinity '
  unit *= sign


  if (unit < 1) {
    const vals = SISteps[1]
    let i = 0

    while (unit < 1 && i < vals.length - 1) unit *= vals[i++][0]

    console.log(unit, vals, i);
    return `${unit >= 1 ? r() : unit} ${vals[--i][1]}`
  }

  const vals = SISteps[0]
  let i = -1

  while (i < vals.length - 1 && unit >= vals[i + 1][0]) unit /= vals[++i][0]

  return `${r()} ${i == -1 ? ' ' : vals[i][1]}`
}

export default function resolve(given, insts) {
  const knowns = JSON.parse(JSON.stringify(given))
  console.log(knowns);
  let lastLen = Object.keys(knowns).length - 1

  while (lastLen != Object.keys(knowns).length) {
    lastLen = Object.keys(knowns).length

    for (const inst of insts) {
      if (knowns[inst.out]) continue
      if (inst.ins.some(el => !knowns[el])) continue

      knowns[inst.out] = inst.fun(...inst.ins.map(el => knowns[el].value))
    }
  }

  return knowns
}
