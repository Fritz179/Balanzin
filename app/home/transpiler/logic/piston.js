const pistons = {}
const names = ['extend', 'retract']
const alias = ['extend', 'retract', 'out', 'in']
const both = ['push', 'outIn', 'outAndIn']
const vars = {4: [false, 'out', 'in', 'in'], 5: [false, 'out', 'out', 'in', 'in']}

senser.push(pistonAdder)
function pistonAdder(tokens, modifiers) {
  if (tokens[0] == 'piston' && Array.isArray(tokens[1])) {

    const params = getParameters(tokens[1], {vars: vars[tokens[1].filter(el => el != ',' && !Array.isArray(el)).length]})

    if (params.length < 4 || params.length > 5) {
      throw new Error(`Expected 4 or 5 arguments, but got: ${params.length}`)
    } else if (!isVariable(params[0])) {
      throw new Error(`Expcted variables, but got: ${parmas.join(' ')}`)
    }

    if (params[1] == 'false') params.splice(1, 1, false) // allow for actuators.out to be false
    if (params.length == 4) params.splice(2, 0, false)   // allow to give only 3 params

    pistons[params[0]] = {
      actuators: {
        extend: params[1] ? analyzeOperation(params[1], {output: true}) : false,
        retract: params[2] ? analyzeOperation(params[2], {output: true}) : false
      },
      reed: {
        retract: timeLiteral(params[3]) || analyzeOperation(params[3]),
        extend: timeLiteral(params[4]) || analyzeOperation(params[4])
      },
      name: params[0]
    }

    tokens.splice(0, 2)

    return true
  }
}

compilers['piston'] = pistonCompiler
function pistonCompiler({action, piston, serial, then, actionName}) {
  const {actuators, reed, name} = piston

  if (action == 'push') {

  } else {
    const con = reed[action]
    const dir = actuators[action]
    const opp = actuators[action == 'retract' ? 'extend' : 'retract']

    if (typeof con != 'object') {
      return `${getSerial(--serial, actionName)}
        $"${name}".TON(
        $$$// First time IN will be false in order to reset ${name}
        IN := ${create(dir || opp)}${dir ? '' : ' = 0'},
        PT := T#${timeLiteral(con)}s,
        // Update flag${serial} automaticly with ${name}
        Q => #flag${serial}
        £££);

        ${create(dir || opp)} := ${dir ? 1 : 0};
        ` + (then.length ? `
        // Execute only once between ${actionName} and the next step
        IF #flag${serial} THEN
          $${compile(then)}
        £END_IF;
        ` : '')
    } else {
      return `${getSerial(--serial, actionName)}
      $${create(dir || opp)} := ${dir ? 1 : 0};

      IF ${create(con)} THEN
        $// Update flag${serial}, move to the next step
        #flag${serial} := 1;
        ${compile(then)}
      £END_IF;
      `
    }
  }
}
