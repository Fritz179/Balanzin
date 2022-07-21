import { header } from '../runner/print.js';
import { registers } from '../assert.js';
function decode(opcode) {
    const a = registers[(opcode >> 0) & 7].padStart(3, ' ');
    const b = registers[(opcode >> 3) & 7].padStart(3, ' ');
    const d = registers[(opcode >> 6) & 7].padStart(3, ' ');
    const val = (opcode >> 9).toString(16).padEnd(2, ' ');
    return `${val}  ${a} ${b} ${d}`;
}
function hex(num, len = 4) {
    const base = num < 0 ? '-0x' : '0x';
    return base + Math.abs(num).toString(16).padStart(len, '0');
}
export default function prettify(source) {
    let prevLines = '';
    return source.map(line => {
        let curr = '';
        if (line.type == 'code') {
            const num = `${(line.lineNumber + 1).toString().padStart(4, '0')}`;
            curr += `${hex(line.bytePos)}: ${hex(line.opcode)}: ${num}: `;
            curr += `| ${decode(line.opcode)} |`;
        }
        else {
            curr += '|                 |'.padStart(41, ' ');
        }
        if (line.type != 'code' || !line.multiLine)
            curr += line.lineText;
        curr += '\n';
        const output = {
            prevLines: '',
            printLine: curr,
            ...line
        };
        if (line.type == 'code') {
            output.prevLines = prevLines;
            prevLines = '';
        }
        else {
            prevLines += curr;
        }
        return output;
    });
}
export function print(source) {
    let output = header;
    for (const line of source) {
        output += line.prevLines + line.printLine;
    }
    return output;
}
