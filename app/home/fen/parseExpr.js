const levels = {
  '+': 3, '-': 3,
  '*': 2, '/': 2,
  '**': 1, '//': 1,
  '(': 4,
  '=': 5
}

export function prettyPrint(str) {
  return str
  function iterate([lhs, op, rhs]) {
    // if (Array.isArray(lhs)) {
    //   if (lhs[1] == op && op == '*') {
    //     return [`${iterate(lhs[0])} ${op} ${iterate(lhs[2])}`, op, rhs]
    //   }
    // }

    return [lhs, op, rhs]
  }

  const res = iterate(splitExpr(str, true))

  return res.join(' ').replaceAll(/,+/g, ' ')
}

export default function splitExpr(str, recursive) {
  const ops = str.split(/(  | |\(|\))/).map(el => el.trim()).filter(el => el.length)

  if (ops.length <= 1) return ops[0]

  const w = recursive ?
    expr => splitExpr(expr, true) :
    expr => Array.isArray(splitExpr(expr)) ? `(${expr})` : expr

  let level = 0
  let pos = 0

  for (let i = 0; i < ops.length; i++) {
    if (levels[ops[i]] > level) {
      level = levels[ops[i]]
      pos = i
    }
  }

  if (level == 4) {
    let depth = 1
    let i = pos + 1

    while (true) {
      if (ops[i] == ')') depth--
      if (ops[i] == '(') depth++

      if (depth == 0) {

        const lhs = ops.splice(0, pos - 1).join(' ')
        const lop = lhs.length ? ops.shift() : ''
        ops.shift() // (
        const mhs = ops.splice(0, i - pos - 1).join(' ')
        ops.shift() // (
        const rop = ops.shift()
        const rhs = ops.join(' ')

        const lvl = levels[lop] || 0
        const rvl = levels[rop] || 0

        if (lvl > rvl) {
          if (rvl) {
            return [w(lhs), lop, w(`(${mhs}) ${rop} ${rhs}`)]
          }

          return [w(lhs), lop, w(mhs)]
        }

        if (rvl > 0) {
          if (lvl > 0) {
            return [w(`${lhs} ${lop} (${mhs})`), rop, w(rhs)]
          }

          return [w(mhs), rop, w(rhs)]
        }

        return splitExpr(mhs)
      }

      i++
    }
  }

  const lhs = ops.splice(0, pos).join(' ')
  const op = ops.shift()
  const rhs = ops.join(' ')

  return [w(lhs), op, w(rhs)]
}
