const definers = ['input', 'ninput', 'output', 'noutput', 'in', 'nin', 'out', 'nout', 'i', 'ni', 'o', 'no', 'i', 'ni', 'q', 'nq']

function getParameters(tokens, modifiers = {}) {
  const {vars = []} = modifiers
  const args = []

  for (let i = 0; i < tokens.length; i++) {
    if (i % 2 == 0) {
      if (Array.isArray(tokens[i + 1])) {
        args.push(definerAnalyzer(tokens.slice(i), {subDefiner: true}))
        tokens.splice(i, 1)
      } else if (isVariable(tokens[i])) {
        if (vars[i / 2] && !timeLiteral(tokens[i])) {
          args.push(definerAnalyzer([vars[i / 2], [tokens[i]]], {subDefiner: true}))
        } else {
          args.push(tokens[i])
        }
      } else {
        throw new Error(`Expected variable at position ${i} in: ${tokens.join(' ')}`)
      }
    } else {
      if (tokens[i] != ',') {
        throw new Error(`Expected ',' but recived ${tokens[i]} at: ${tokens.join(' ')}`)
      }
    }
  }

  return args
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

senser.push(definerAnalyzer)
function definerAnalyzer(tokens, modifiers = {}) {
  if (definers.includes(tokens[0])) {
    if (!Array.isArray(tokens[1])) {
      throw new Error(`${tokens[0]} must be followed by a function call`)
    }

    const params = getParameters(tokens[1])

    if (!params.length || params.length > 3) {
      throw new Error(`Expected 1 to 3 arguments, but got: ${params.length}`)
    } else if (!isVariable(params[0])) {
      throw new Error(`Expcted variables, but got: ${parmas.join(' ')}`)
    }

    const pos = definers.indexOf(tokens[0]) % 4
    const name = params[1] ? `"${params[1]}"` : `"${pos > 1 ? 'Q' : 'I'}x_${capitalize(params[0])}"`

    variables[pos > 1 ? 'outputs' : 'inputs'][params[0]] = name

    if (pos == 1) {
      const inverted = name.split('')
      inverted.splice(4, 0, 'n')
      invertedInputs[name] = params[2] || inverted.join('')
    } else if (pos == 3) {
      console.error('inverted outpust?');
    }

    tokens.splice(0, 2)

    if (modifiers.subDefiner) {
      return params[0]
    } else {
      return true
    }
  }
}

compilers['definer'] = definerCompiler
function definerCompiler({expression}) {
  return compile(expression)
}
