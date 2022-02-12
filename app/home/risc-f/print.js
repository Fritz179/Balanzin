function hexNum() {

}

function hexImm() {

}

function hex(num) {
  const base = num < 0 ? '-0x' : '0x'
  return base + Math.abs(num).toString(16).padStart(4, '0')
}

const REGISTERS = ['pc ', 'sp ', 'si ', 'di ', 'a  ', 'b  ', 'c  ', 'ram']
function decode({opcode}) {
  const a = REGISTERS[(opcode << 0) & 7]
  const b = REGISTERS[(opcode << 3) & 7]
  const d = REGISTERS[(opcode << 6) & 7]

  return `${a} ${b} ${d}`
}

export function printParsed(parsed) {
  let output = `ADDRESS OPCODE  a   b   d   |\n`
  output += `${'|'.padStart(29, '-')}\n`

  parsed.forEach(line => {
    if (line.inst) {
      output += `${hex(line.bytePos)}: ${hex(line.opcode)}: ${decode(line)} |`
    } else {
      output += '|'.padStart(29, ' ')
    }

    output += line.line
    output += '\n'
  })

  return output
}