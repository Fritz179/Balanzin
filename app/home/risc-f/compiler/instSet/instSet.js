import { instSet, execSet } from './emptySets.js';
export { instSet, execSet };
export function addOP(name, inst, exec) {
    instSet[name] = inst;
    execSet[name] = exec;
}
import './alu.js';
import './ram.js';
import './jmp.js';
