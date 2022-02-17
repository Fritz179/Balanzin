import { setCurrentLine, assertLine } from '../assert.js';
import { instSet } from './instSet/instSet.js';
const consts = { bytePos: 0 };
export function setConst(dest, prop, val) {
    assertLine(typeof dest[prop] == 'undefined', 'Already defined');
    dest[prop] = val;
}
export function getConst(index) {
    return consts[index];
}
function walk(source, labels, lastPass) {
    function resolveArgs(args) {
        return args.map(arg => {
            switch (arg.type) {
                case 'number': return arg.value;
                case 'string': return arg.value;
                case 'register': return arg.value;
                case 'const': {
                    if (typeof consts[arg.value] == 'number') {
                        if (lastPass)
                            arg.exec = consts[arg.value];
                        return consts[arg.value];
                    }
                    if (typeof labels[arg.value] == 'number') {
                        if (lastPass)
                            arg.exec = labels[arg.value];
                        return labels[arg.value];
                    }
                    assertLine(!lastPass, 'Unresolved symbol');
                    return Infinity;
                }
            }
        });
    }
    const output = [];
    for (const line of source) {
        setCurrentLine(line);
        if (line.place) {
            labels[line.place] = consts.bytePos;
        }
        if (line.type == 'text') {
            output.push([line, []]);
            continue;
        }
        const { inst, args } = line;
        const resolver = instSet[inst];
        assertLine(resolver, 'Unknow instruction');
        const solution = resolver(...resolveArgs(args));
        consts.bytePos += solution.length;
        output.push([line, solution]);
    }
    return output;
}
export default function assemble(source) {
    // first pass => resolve all consts and max program length
    consts.bytePos = 0;
    const firstLabels = {};
    walk(source, firstLabels, false);
    // second pass => shorten insts with first pass symbol estimate
    consts.bytePos = 0;
    const secondLabels = {};
    walk(source, secondLabels, false);
    // Can a third pass shorten the opcodes even furhter? If it can, not by much
    // resolution pass => correct every opcode with exact symbol => fix-up list
    consts.bytePos = 0;
    const walked = walk(source, secondLabels, true);
    const program = [];
    let bytePos = 0;
    walked.forEach(([src, solutions]) => {
        if (src.type == 'text') {
            program.push(src);
            return;
        }
        if (!solutions.length) {
            const { lineText, lineNumber, comment, place } = src;
            program.push({ type: 'text', lineText, lineNumber, comment, place });
            return;
        }
        solutions.forEach((solution, i) => {
            const line = JSON.parse(JSON.stringify(src));
            line.bytePos = bytePos;
            line.opcode = solution;
            line.multiLine = i >= 1;
            program.push(line);
            bytePos++;
        });
    });
    return program;
}
