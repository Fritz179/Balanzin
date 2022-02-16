function hex(num, len = 4) {
    const base = num < 0 ? '-0x' : '0x';
    return base + Math.abs(num).toString(16).padStart(len, '0');
}
const sep = `${'----------------------|-----------------|'.padEnd(80, '-')}\n`;
const header = `ADDRESS OPCODE  LINE  | op  a   b   d   |\n` + sep;
import { NUM_TO_REG } from './parse.js';
function decode(opcode) {
    const a = NUM_TO_REG[(opcode >> 0) & 7].padStart(3, ' ');
    const b = NUM_TO_REG[(opcode >> 3) & 7].padStart(3, ' ');
    const d = NUM_TO_REG[(opcode >> 6) & 7].padStart(3, ' ');
    const val = (opcode >> 9).toString(16).padEnd(2, ' ');
    return `${val}  ${a} ${b} ${d}`;
}
export default function print(parsed) {
    let output = header;
    let prevLines = '';
    parsed.forEach(line => {
        let curr = '';
        if (line.inst) {
            const num = `${(line.lineNumber + 1).toString().padStart(4, '0')}`;
            curr += `${hex(line.bytePos)}: ${hex(line.opcode)}: ${num}: `;
            curr += `| ${decode(line.opcode)} |`;
        }
        else {
            curr += '|                 |'.padStart(41, ' ');
        }
        if (!line.multiLine)
            curr += line.lineText;
        curr += '\n';
        output += curr;
        line.printLine = curr;
        if (line.inst) {
            line.prevLines = prevLines;
            prevLines = '';
        }
        else {
            prevLines += curr;
        }
    });
    return output;
}
import { readValue } from './run.js';
export function printState() {
    function printReg(name) {
        const value = readValue(name, true);
        if (!value)
            return `${name}: 0x####`;
        return `${name}: 0x${value.value.toString(16).padStart(4, '0')}`;
    }
    function printLine(index, current) {
        const memory = readValue(index, true);
        if (!memory)
            return ['|                 |'.padStart(41, ' ')];
        const { value, line } = memory;
        if (!line) {
            return [''];
        }
        if (value != line.opcode)
            console.log('Error');
        let output = '';
        if (current) {
            output += line.prevLines;
            output += `<span style="color: #4f4">${sep}`;
            output += line.printLine;
            output += `${sep.slice(0, -1)}</span>\n`;
        }
        else {
            output = line.prevLines + line.printLine;
        }
        return output.split('\n').slice(0, -1);
    }
    let output = 'REGISTERS:\n';
    output += `${printReg('a')} | ${printReg('si')} | ${printReg('sp')}\n`;
    output += `${printReg('b')} | ${printReg('di')} | ${printReg('pc')}\n`;
    output += `${printReg('c')}\n`;
    output += `\n${''.padStart(80, '#')}\n\n`;
    const pc = readValue('pc', true).value;
    const border = 5;
    const start = pc - border;
    const end = pc + border;
    output += header;
    let lines = [];
    for (let i = start; i < pc; i++) {
        lines = lines.concat(printLine(i, false));
    }
    lines = lines.concat(printLine(pc, true));
    const middle = lines.length;
    for (let i = pc + 1; i <= end; i++) {
        lines = lines.concat(printLine(i, false));
    }
    output += lines.splice(middle - border - 3, border * 2 + 3).join('\n');
    document.getElementById('output').innerHTML = output;
}
