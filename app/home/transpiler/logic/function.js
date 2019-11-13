senser.push(functionAnalyzer)
function functionAnalyzer(tokens, modifiers) {
  if (tokens[0] == 'function') {
    if (!isVariable(tokens[1])) {
      throw new Error('function without name!')
    } else if (!Array.isArray(tokens[2])) {
      throw new Error(`function ${tokens[1]} without conditions!`)
    } else if (!Array.isArray(tokens[3]) || !tokens[2].length) {
      throw new Error(`function ${tokens[1]} without body!`)
    }

    const out = {
      type: 'function',
      name: tokens[1],
      paramenters: tokens[2],
      expression: makeSenseOf(tokens[3])
    }

    tokens.splice(0, 4)
    return out

  }
}

compilers['function'] = functionCompiler
function functionCompiler({expression}) {
  return compile(expression)
}
