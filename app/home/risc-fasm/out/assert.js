export function assert(cond, msg) {
    if (!cond)
        throw msg;
}
// Used when assertion arises while compiling
let line = null;
export function setCurrentLine(currentLine) {
    line = currentLine;
}
export function getCurrentLine() {
    assert(line != null, 'Line not yet setted');
    return line;
}
export function assertLine(cond, msg) {
    assert(line != null, 'Line not yet setted');
    const { lineNumber, lineText } = line;
    assert(cond, `Error: ${msg}\n\tat line: ${lineNumber}: "${lineText}"`);
}
export var registers;
(function (registers) {
    registers[registers["pc"] = 0] = "pc";
    registers[registers["sp"] = 1] = "sp";
    registers[registers["si"] = 2] = "si";
    registers[registers["di"] = 3] = "di";
    registers[registers["a"] = 4] = "a";
    registers[registers["b"] = 5] = "b";
    registers[registers["c"] = 6] = "c";
    registers[registers["ram"] = 7] = "ram";
})(registers || (registers = {}));
export function isRegister(register) {
    // @ts-ignore
    return registers[register] !== undefined;
}
function assertRegister(register) {
    assertLine(typeof register == 'string', 'Not a valid register');
    assertLine(isRegister(register), 'Not a valid register');
    // @ts-ignore
    return registers[register];
}
export function assertRegisters(a, b, d) {
    const regA = assertRegister(a);
    const regB = assertRegister(b);
    const regD = assertRegister(d);
    return (regA << 0) + (regB << 3) + (regD << 6);
}
const MIN_SIMM = -64;
const MAX_SIMM = +63;
const MIN_UIMM = 0;
const MAX_UIMM = 127;
export function assertImmediate(value) {
    assert(typeof value == 'number', 'Invalid operand');
    // non defined constant / label is Infinity in first pass
    if (value == Infinity)
        return Infinity;
    assertLine(value >= MIN_SIMM, `Immedaite value ${value} below ${MIN_SIMM}`);
    assertLine(value <= MAX_SIMM, `Immedaite value ${value} above ${MAX_SIMM}`);
    if (value < 0)
        return MAX_UIMM + value + 1;
    return value;
}
