const operations = {
  '>': '$ > £',
  '<': '$ < £',
  '==': '$ = £',
  '!=': '$ <> £',
  '>=': '$ >= £',
  '<=': '$ <= £',
  '+': '$ + £;\n',
  '-': '$ - £;\n',
  '*': '$ * £;\n',
  '/': '$ / £;\n',
  '=': '$ := £;\n',
  '&&': '$ & £;\n',
  '||': '$ OR £;\n',
  '^': '$ XOR £;\n',
  '++': '$ := $ + 1;\n',
  '--': '$ := $ - 1;\n',
  '!!': '$ := $ = 0;\n',
  '+=': '$ := $ + £;\n',
  '-=': '$ := $ - £;\n',
  '*=': '$ := $ * £;\n',
  '/=': '$ := $ / £;\n',
  '%=': '$ := $ MOD £;\n'
}

const constants = ['true', 'false']

senser.push(analyzeOperation)
function analyzeOperation(tokens, modifiers = {}) {

  // Inverter
  if (tokens[0] == '!') {
    if (!isVariable(tokens[1])) {
      throw new Error(`Cannot negate: ${tokens[1]}`)
    }

    const out = {
      type: 'negation',
      value: analyzeOperation(tokens[1], {condition: true, arr: true})
    }

    tokens.splice(0, 2)
    return out
  }

  // Number literal or variable
  if (!Array.isArray(tokens) && isVariable(tokens)) {
    return {type: 'value', value: tokens, output: modifiers.output}
  }

  let isArr = Array.isArray(tokens[0])
  if (isArr || isVariable(tokens[0]) || !operations[tokens[1]]) {
    if (!operations[tokens[1]]) {
      let out
      if (isArr) {
        out = analyzeOperation(tokens[0], {subOp: true, arr: true, output: modifiers.output})
      } else {
        out = {
          type: 'value',
          value: tokens[0]
        }
      }

      tokens.splice(0, 1)
      return out
    }

    if (tokens[1] == '++' || tokens[1] == '--' || tokens[1] == '!!') {
      tokens.splice(2, 0, 'placeholder')
    }

    let rest
    const out = {
      type: 'operation',
      as: operations[tokens[1]],
      a: analyzeOperation(tokens[0], {subOp: true, arr: Array.isArray(tokens[0])}),
      b: analyzeOperation(rest = tokens.slice(2), {subOp: true}),
      parenthesis: modifiers.arr,
      semicolumn: !modifiers.subOp && !modifiers.condition
    }

    tokens.splice(0, tokens.length - rest.length)
    return out
  }
}

compilers['value'] = valueCompiler
function valueCompiler({value, output}) {
  if (output && variables.outputs[value]) {
    return variables.outputs[value]
  }
  return variables.inputs[value] || variables.outputs[value] ||
  (constants.indexOf(value) != -1 ? value :
  (integerLiteral(value) ? value : `#${value}`))
}

compilers['negation'] = negationCompiler
function negationCompiler({value}) {
  return `${create(value)} = 0`
}

compilers['operation'] = operationCompiler
function operationCompiler({as, a, b, semicolumn, parenthesis}) {
  let base = as.replace(/\$/g, create(a)).replace('£', create(b))
  if (!semicolumn) base = base.replace(';', '').replace('\n', '')
  return parenthesis ? `(${base})` : base
}
