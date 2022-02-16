import { setCurrentLine, getCurrentLine, assertLine } from './assert.js';
import { execSet } from './instSet/instSet.js';
import { printState } from './print.js';
import { NUM_TO_REG } from './parse.js';
const state = {
    eeprom: [],
    ram: [],
    registers: {},
    currActions: [],
    prevActions: [],
    running: false
};
export function readValue(location, empty) {
    const i = Number(location);
    if (Number.isNaN(i)) {
        // @ts-ignore
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
        console.log('Getting', index, readValue(index, false).value);
        return readValue(index, false).value;
    },
    set(_to, location, value) {
        console.log('Setting', location, value);
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
function runNext() {
    const line = readValue(state.registers.pc.value, false).line;
    assertLine(line, 'No instruction at pc!');
    setCurrentLine(line);
    const resolver = execSet[line.inst];
    assertLine(resolver, 'Invalid instruction');
    resolver(...line.args.map(el => el.exec));
    memory['pc'] = memory['pc'] + 1;
    state.prevActions.push(state.currActions);
    state.currActions = [];
    printState();
}
function runBack() {
    if (!state.prevActions.length)
        return;
    const undoActions = state.prevActions.pop();
    while (undoActions.length) {
        const [index, value] = undoActions.pop();
        state.registers[index] = value;
    }
    state.currActions = [];
    printState();
}
window.addEventListener('keydown', (e) => {
    if (!state.running)
        return;
    try {
        switch (e.key) {
            case 'n':
                runNext();
                break;
            case 'b':
                runBack();
                break;
            case 'i':
                console.log(state);
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
export default function run(program) {
    if (!program.length) {
        state.running = false;
        return;
    }
    state.running = true;
    state.eeprom = [];
    state.ram = [];
    state.registers = { pc: { value: 0, creator: program[0] } };
    for (const line of program) {
        if (line.opcode != null) {
            state.eeprom[line.bytePos] = { value: line.opcode, creator: line, line };
        }
    }
    console.log(state.eeprom, program);
    printState();
}
