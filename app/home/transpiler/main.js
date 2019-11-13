const input = document.getElementById('input')
const output = document.getElementById('output')
let indentation = '    '
let variables = {inputs: {}, outputs: {}, process: {}}
let invertedInputs = {}

// Balanzin\app\home\transpiler

input.value = `piston(armHorizontal, horOut, 2s, horOut)
piston(armVertical, verOut, verIn, verIn, 3s)

process main(active) {
  counter++

  await true
        bandFree = false
  await armVertical.extend()
  await armVertical.retract()
        bandFree = true
  await armHorizontal.extend()
  await armVertical.extend()
        mx_isEmpty = ix_isEmpty
  await armVertical.retract()
  await armHorizontal.retract()
        bandFree = false
  await armVertical.extend()
  await armVertical.extend()
        bandFree = true
  }`

let totalTimers = 0
output.value = parse(input.value)
input.addEventListener('change', () => {
  output.value = parse(input.value)
})

function sanitize(string) {
  const lines = string.split('\n')
  let output = ''
  let indent = 0

  lines.forEach(line => {
    line = line.trim()

    while (line[0] == '$' || line[0] == '£') {
      indent += line[0] == '$' ? 1 : -1
      line = line.slice(1)
    }
    output += indentation.repeat(indent).concat(line) + '\n'
  })

  return output
}

function parse(string) {
  variables = {inputs: {}, outputs: {}, process: {}}
  invertedInputs = {}

  try {
    const tokens = tokenize(string)
    console.log('tokens:', JSON.parse(JSON.stringify(tokens)));
    const tree = makeSenseOf(tokens)
    console.log('tree:', JSON.parse(JSON.stringify(tree)));
    const compiled = preCompile() + compile(tree)
    console.log('compiled: ', compiled);
    const sanitized = sanitize(compiled)
    console.log('sanitized:\n', sanitized);
    console.log(`Source length: ${string.length}, output length: ${sanitized.length}`);
    console.log(`The output is ${Math.round(sanitized.length / string.length * 1000) / 1000} times longer!`);
    return sanitized
  } catch (e) {
    console.error(e);
    return e
  }
}
