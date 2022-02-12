function hexNum() {

}

function hexImm() {

}

function hex(num, len = 4) {
  const base = num < 0 ? '-0x' : '0x'
  return base + Math.abs(num).toString(16).padStart(len, '0')
}

const REGISTERS = ['pc ', 'sp ', 'si ', 'di ', 'a  ', 'b  ', 'c  ', 'ram']
function decode({opcode}) {
  const a = REGISTERS[(opcode >> 0) & 7]
  const b = REGISTERS[(opcode >> 3) & 7]
  const d = REGISTERS[(opcode >> 6) & 7]
  const val = (opcode >> 9).toString(16).padEnd(2, ' ')

  return `${val}  ${a} ${b} ${d}`
}

export default function print(parsed) {
  let output = `ADDRESS OPCODE  | op  a   b   d   |\n`
  output += `${'----------------|-----------------|'.padEnd(80, '-')}\n`

  parsed.forEach(line => {
    if (line.inst) {
      output += `${hex(line.bytePos)}: ${hex(line.opcode)}: | ${decode(line)} |`
    } else {
      output += '|                 |'.padStart(35, ' ')
    }

    if (!line.multiLine) output += line.line
    output += '\n'
  })

  return output
}