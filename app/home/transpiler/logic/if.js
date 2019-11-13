senser.push(ifAnalyzer)
function ifAnalyzer(tokens, modifiers) {
  if (tokens[0] == 'if') {
    if (!Array.isArray(tokens[1]) || !Array.isArray(tokens[2])) {
      throw new Error(`Malformed if statement!`)
    } else if (!tokens[1].length) {
      throw new Error('No expression in if statement')
    }

    const out = {
      type: 'if',
      condition: analyzeOperation(tokens[1], {condition: true}),
      expression: makeSenseOf(tokens[2]),
      elsifs: [],
      otherwise: false
    }

    tokens.splice(0, 3)
    while (tokens[0] == 'else' && tokens[1] == 'if') {
      if (!Array.isArray(tokens[2]) || !Array.isArray(tokens[3])) {
        throw new Error(`Malformed else if statement!`)
      }

      out.elsifs.push({
        condition: analyzeOperation(tokens[2], {condition: true}),
        expression: makeSenseOf(tokens[3])
      })
      tokens.splice(0, 4)
    }

    if (tokens[0] == 'else') {
      if (!Array.isArray(tokens[1])) {
        throw new Error(`Malformed else statement!`)
      }

      out.otherwise = makeSenseOf(tokens[1])
      tokens.splice(0, 2)
    }

    return out

  }
}

function getSerial(serial, actionName) {
  return `${serial ? '£ELS' : ''}IF #flag${serial} = 0 THEN${serial ? '' : '   '}        /***** ${actionName || 'STEP ' + serial} *****/`
}

compilers['if'] = ifCompiler
function ifCompiler({condition, expression, serial, elsifs, otherwise}) {
  if (serial) {
    if (create(condition) == 'true') {
      return `
      ${getSerial(--serial)}
      $// execute always once
      #flag${serial} := 1;
      ${compile(expression)}
      `
    } else {
      return `
      ${getSerial(--serial)}
      $IF ${create(condition)} THEN
        $// Update flag${serial}, move to the next step
        #flag${serial} := 1;

        ${compile(expression)}
        £END_IF;
      `
    }
  } else {
    return `\nIF ${create(condition)} THEN
    $${compile(expression)}
    ${compileElse(elsifs, otherwise)}
    £END_IF;
    `
  }
}

function compileElse(elsifs, otherwise) {
  let out = ''

  elsifs.forEach(elsif => {
    out += `£ELSIF ${create(elsif.condition)} THEN
    $${compile(elsif.expression)}
    `
  })

  if (otherwise) {
    out += `£ELSE
    $${compile(otherwise)}`
  }

  return out
}
