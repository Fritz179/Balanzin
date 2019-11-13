function getNextTokenSection(tokens, stop, modifiers) {
  if (tokens.indexOf(stop) == -1) {
    const ret = makeSenseOf(Array.isArray(tokens[0]) ? tokens[0] : tokens, modifiers)
    tokens.splice(0, 1) // slice empty array
    return ret
  } else {
    let next = Array.isArray(tokens[0]) ? tokens[0] : tokens.splice(0, tokens.indexOf(stop))
    return makeSenseOf(next, modifiers)
  }
}

senser.push(awaitAnalyzer)
function awaitAnalyzer(tokens, modifiers) {
  if (tokens[0] == 'await') {
    const splitted = !Array.isArray(tokens[1]) && tokens[1].length ? tokens[1].split('.') : false
    if (splitted && splitted.length > 1) {
      if (!pistons[splitted[0]]) {
        throw new Error(`No piston named: ${splitted[0]}`)
      }

      if (!modifiers.currentFlag) {
        throw new Error('piston can only be used inside a process')
      }
      if (Array.isArray(tokens[1])) tokens.splice(1, 1)

      if (alias.indexOf(splitted[1]) == -1 && both.indexOf(splitted[1]) == -1) {
        throw new Error(`Invalid action ${splitted[1]}, valids: ${both.concat(alias).join(', ')}`)
      }

      let action, addNext

      if (both.includes(splitted[1])) {
        action = 'extend'
        addNext = true
      } else {
        action = names[alias.indexOf(splitted[1]) % 2]
      }

      const out = {
        action,
        type: 'piston',
        piston: pistons[splitted[0]],
        serial: modifiers.currentFlag++,
        actionName: `${action} ${splitted[0]}`.toUpperCase()
      }

      tokens.splice(0, 3)
      if (addNext) tokens.unshift('await', `${splitted[0]}.retract`, '[]')
      out.then = getNextTokenSection(tokens, 'await', modifiers)

      return out
    }

    if (!Array.isArray(tokens[1]) && timeLiteral(tokens[1])) {
      const out = {
        type: 'ton',
        name: `#Wait_${tokens[1]}_${totalTimers}`,
        time: timeLiteral(tokens[1]),
        serial: modifiers.currentFlag++,
        output: `#Waited_${tokens[1]}_${totalTimers++}`,
        autoReset: true
      }

      tokens.splice(0, 2)
      out.then = getNextTokenSection(tokens, 'await', modifiers)


      return out
    }

    // otherwise
    let res
    const out = {
      type: 'if',
      serial: modifiers.currentFlag++,
      condition: analyzeOperation(res = tokens.slice(1), {condition: true}),
    }

    tokens.splice(0, tokens.length - res.length)
    out.expression = getNextTokenSection(tokens, 'await', modifiers)

    return out
  }
}

compilers['ton'] = tonCompiler
function tonCompiler({name, time, output, then, autoReset, serial, input}) {
  if (serial) {
    return `
    ${getSerial(--serial)}
    $"${name}".TON(
      $$$IN := ${input ? '#' + input : 'true'},
         PT := T#${time}s,
         Q => #${output}
      £££);

      IF #${output} THEN

      $${getResetter(name, autoReset, time)}

      // Update flag${serial}, move to the next step
      #flag${serial} := 1;

      ${compile(then)}
      £END_IF;
      `
  } else {
    return `"${name}".TON(
      $$$IN := true,
      PT := T#${time}s,
      Q => #${output}
      £££);

      IF #${output} THEN

      $${getResetter(name, autoReset, time)}

      ${compile(then)}
      £END_IF;
      `
  }
}

function getResetter(name, autoReset, time) {
  if (autoReset) {
    return `// automaticly restet ${name}
    "${name}".TON(
    $$$IN := false,
       PT := T#${time}s
    £££);`
  } else {
    return `// After ${time} this will executed until ${name} is resetted`
  }
}
