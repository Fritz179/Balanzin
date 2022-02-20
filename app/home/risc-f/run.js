import { setCurrentLine, getCurrentLine, assertLine } from './assert.js';
import { execSet } from './compiler/instSet/instSet.js';
import { printState } from './print.js';
import { NUM_TO_REG } from './compiler/parser.js';
export const state = {
    eeprom: [],
    ram: [],
    registers: {},
    currActions: [],
    prevActions: [],
    running: false,
    flags: 0,
    steps: 0,
};
let doDebug = false;
function debug(...msg) {
    if (doDebug)
        console.log(...msg);
}
export var flags;
(function (flags) {
    flags[flags["CF"] = 0] = "CF";
    flags[flags["ZF"] = 1] = "ZF";
    flags[flags["NF"] = 2] = "NF";
})(flags || (flags = {}));
export function setFlag(flag, to) {
    if (to) {
        state.flags |= 1 << flag;
    }
    else {
        state.flags &= ~(1 << flag);
    }
}
export function getFlag(flag) {
    return state.flags & (1 << flag);
}
export function setFlags(a, b, d) {
    setFlag(flags.CF, d < 0 || d >= 65536);
    if (d < 0)
        d += 65536;
    if (d >= 65536)
        d -= 65536;
    setFlag(flags.NF, d >= 32278);
    setFlag(flags.ZF, d == 0);
    return d;
}
export function readValue(location, empty) {
    const i = Number(location);
    if (Number.isNaN(i)) {
        assertLine(NUM_TO_REG.includes(location), 'Invalid memory access');
        const value = state.registers[location];
        assertLine(value || empty, 'Invalid memory access');
        return value;
    }
    // for now only acces eeprom
    const value = state.eeprom[i];
    assertLine(value || empty, 'Invalid memory access');
    return value;
}
export const memory = new Proxy([], {
    get(_from, index) {
        debug('Getting', index, readValue(index, false).value);
        return readValue(index, false).value;
    },
    set(_to, location, value) {
        debug('Setting', location, value);
        if (value > 65535 || value < 0)
            console.log('Invalid setting value');
        state.currActions.push([location, readValue(location, true)]);
        const newValue = { value, creator: getCurrentLine() };
        const i = Number(location);
        if (Number.isNaN(i)) {
            assertLine(NUM_TO_REG.includes(location), 'Invalid memory access');
            state.registers[location] = newValue;
            return true;
        }
        // for now only set eeprom
        state.eeprom[i] = newValue;
        return true;
    }
});
function runNext(show) {
    const line = readValue(state.registers.pc.value, false).line;
    assertLine(line, 'No instruction at pc!');
    debug('Running: ' + line.inst);
    setCurrentLine(line);
    const resolver = execSet[line.inst];
    assertLine(resolver, 'Invalid instruction');
    resolver(...line.args.map(el => el.exec));
    memory['pc']++;
    state.prevActions.push(state.currActions);
    state.currActions = [];
    state.steps++;
    if (show)
        printState();
}
function runBack() {
    if (!state.prevActions.length)
        return;
    const undoActions = state.prevActions.pop();
    while (undoActions.length) {
        const [index, value] = undoActions.pop();
        const i = Number(index);
        if (Number.isNaN(i)) {
            state.registers[index] = value;
        }
        else {
            state.eeprom[i] = value;
        }
    }
    state.currActions = [];
    state.steps--;
    printState();
}
function start() {
    let i = 0;
    const start = Date.now();
    while (getCurrentLine().inst != 'HLT') {
        runNext(false);
        assertLine(i < 10000, 'no HLT inst');
        i++;
    }
    printState();
    const time = (Date.now() - start);
    console.log(`${Math.round(state.steps / time)}kHz`);
}
window.addEventListener('keydown', (e) => {
    if (!state.running)
        return;
    try {
        switch (e.key) {
            case 'n':
                runNext(true);
                break;
            case 'b':
                runBack();
                break;
            case 'd':
                doDebug = !doDebug;
                break;
            case 'i':
                console.log(state);
                break;
            case 's':
                start();
                break;
        }
    }
    catch (e) {
        console.error(e);
        const output = document.getElementById('output');
        output.innerHTML = `${e}\n\n${output.innerHTML}`;
        output.classList.add('error');
        if (e instanceof Error) {
            throw e;
        }
    }
});
export default function run(all) {
    const program = all.filter(el => el.type == 'code');
    if (!program.length) {
        state.running = false;
        return;
    }
    state.running = true;
    state.eeprom = [];
    state.ram = [];
    state.registers = {
        pc: { value: 0, creator: program[0] },
        sp: { value: 0, creator: program[0] }
    };
    for (const line of program) {
        state.eeprom[line.bytePos] = { value: line.opcode, creator: line, line };
    }
    console.log(program);
    setCurrentLine(program[0]);
    printState();
}
