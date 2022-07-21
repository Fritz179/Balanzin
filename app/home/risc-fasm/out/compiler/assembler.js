import { setCurrentLine, assertLine } from '../assert.js';
import { instSet } from './instSet/instSet.js';
import directives from './directives.js';
import evaluetor from './evaluator.js';
const consts = { bytePos: 0 };
let labels = {};
let lastPass = false;
export function setConst(prop, val) {
    consts[prop] = val;
}
export function getConst(index) {
    if (!Number.isNaN(Number(index)))
        return Number(index);
    if (typeof consts[index] == 'number')
        return consts[index];
    if (typeof labels[index] == 'number')
        return labels[index];
    assertLine(!lastPass, 'Unresolved symbol');
    return Infinity;
}
function walk(source) {
    function resolveArgs(args) {
        return args.map(arg => {
            switch (arg.type) {
                case 'number': return arg.value;
                case 'string': return arg.value;
                case 'register': return arg.value;
                case 'const': {
                    const value = evaluetor(arg.value);
                    if (lastPass)
                        arg.exec = value;
                    return value;
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
        if (line.type == 'directive') {
            const resolver = directives[inst];
            assertLine(resolver, 'Invalid directive!');
            resolver(...args);
            output.push([line, []]);
            continue;
        }
        const resolver = instSet[inst];
        assertLine(resolver, 'Unknow instruction');
        const solution = resolver(...resolveArgs(args));
        consts.bytePos += solution.length;
        output.push([line, solution]);
    }
    return output;
}
export default function assemble(source) {
    lastPass = false;
    // first pass => resolve all consts and max program length
    consts.bytePos = 0;
    labels = {};
    walk(source);
    // second pass => shorten insts with first pass symbol estimate
    consts.bytePos = 0;
    labels = {};
    walk(source);
    // Can a third pass shorten the opcodes even furhter? If it can, not by much
    // resolution pass => correct every opcode with exact symbol => fix-up list
    lastPass = true;
    consts.bytePos = 0;
    const walked = walk(source);
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
