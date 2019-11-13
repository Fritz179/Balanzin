const senser = []

function makeSenseOf(tokens, modifiers = {}) {
  const tree = []
  while (tokens.length) {
    if (!tokens[0].length) {
      throw new Error(`Invalid function call: ${tokens.join(' ') || '(last function)'}`)
    }

    let found = false
    for (var i = 0; i < senser.length; i++) {
      const out = senser[i](tokens, modifiers)
      if (out) {
        if (out !== true) {
          tree.push(out)
        }
        found = true
        break
      }
    }

    if (!found) {
      throw new Error(`Unexpected token: ${tokens[0]}\n Stopped at: `.concat(tokens.join(' ')))
    }
  }

  return tree
}

function stringLiteral(token) {
  return token.match(/^[a-zA-Z_]+$/)
}

function isVariable(token) {
  return token.match(/^[a-zA-Z1-9_]+$/)
}

function integerLiteral(val) {
  return val.match(/^[1-9]+$/) ? val : false
}

function timeLiteral(val) {
  return val.match(/^[0-9]+(\.[0-9]+)?s$/) ? val.slice(0, val.length - 1) : integerLiteral(val)
}
