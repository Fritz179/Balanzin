senser.push(processAnalyzer)
function processAnalyzer(tokens, modifiers) {
  if (tokens[0] == 'process') {
    if (!isVariable(tokens[1])) {
      throw new Error(`Malformed process statement!, Missing formal name`)
    } else if (!Array.isArray(tokens[2]) || !Array.isArray(tokens[3])) {
      throw new Error(`Malformed process statement!, missing parenthesis`)
    }

    let flagCounter = {currentFlag: 1}
    let out = variables.process[tokens[1]] = {
      type: 'process',
      condition: tokens[2][0] || `start${capitalize(tokens[1])}Process`,
      keepAlive: tokens[2][2] || `keep${capitalize(tokens[1])}Alive`,
      expression: makeSenseOf(tokens[3], flagCounter),
      flagCounter
    }

    tokens.splice(0, 4)
    return out
  }
}

compilers['process'] = processCompiler
function processCompiler({expression, condition, keepAlive, flagCounter}) {
  return `IF #${condition} OR #${keepAlive} THEN
  $#${keepAlive} := 1;

  ${compile(expression)}
  £ELSE                        /***** RESET FLAGS ******/

  $// process ended, reset all flags
  #${keepAlive} := 0;
  ${resetAllFlags(flagCounter)}
  £END_IF;
  £END_IF;

  `
}

function resetAllFlags({currentFlag}) {
  if (--currentFlag == 0) {
    throw new Error('Cannot have a process without at least one await')
  }

  let out = ''
  for (let i = 0; i < currentFlag; i++) {
    out += `#flag${i} := 0;\n`
  }

  return out.slice(0, out.length - 1)
}
