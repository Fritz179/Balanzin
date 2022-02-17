const sep = `${'----------------------|-----------------|'.padEnd(80, '-')}\n`
const header = `ADDRESS OPCODE  LINE  | op  a   b   d   |\n` + sep
export {header}

import {readValue} from './run.js'

// while running
export function printState() {

  function printReg(name: string) {
    const value = readValue(name, true)
    if (!value) return `${name}: 0x####`
    
    return `${name}: 0x${value.value.toString(16).padStart(4, '0')}`
  }

  function printLine(index: number, current: boolean): string[] {
    const memory = readValue(index, true)
    if (!memory) return ['|                 |'.padStart(41, ' ')]

    const {value, line} = memory
    if (!line) {
      return ['NO_LINE']
    }

    if (value != line.opcode) console.log('Error');

    let output = ''
    if (current) {
      output += line.prevLines
      output += `<span style="color: #4f4">${sep}`
      output += line.printLine
      output += `${sep.slice(0, -1)}</span>\n`
    } else {
      output = line.prevLines + line.printLine
    }
    return output.split('\n').slice(0, -1)
  }

  // add registers
  let output = 'REGISTERS:\n'
  output += `${printReg('a')} | ${printReg('si')} | ${printReg('sp')}\n`
  output += `${printReg('b')} | ${printReg('di')} | ${printReg('pc')}\n`
  output += `${printReg('c')}\n`
  output += `\n${''.padStart(80, '#')}\n\n`

  // add execution status
  const pc = readValue('pc', true).value
  const border = 5
  const start = pc - border
  const end = pc + border

  output += header

  let lines: string[] = []
  for (let i = start; i < pc; i++) {
    lines = lines.concat(printLine(i, false))
  }

  lines = lines.concat(printLine(pc, true))
  const middle = lines.length

  for (let i = pc + 1; i <= end; i++) {
    lines = lines.concat(printLine(i, false))
  }

  output += lines.splice(middle - border - 3, border * 2 + 3).join('\n')

  // add memory status as display
  output += '\n\n\nDISPLAY:\n'
  const width = 16
  const height = 16

  // start from
  const charSet = ['  ', '[]']
  const vram = 0xfe00
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = vram + y * width + x
      const char = readValue(i, true)?.value ? 1 : 0

      output += charSet[char]
    }

    output += '\n'
  }

  document.getElementById('output')!.innerHTML = output
}
