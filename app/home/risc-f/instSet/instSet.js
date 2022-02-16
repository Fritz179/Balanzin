import { instSet, execSet } from './sets/emptySets.js';
export { instSet, execSet };
export function addOP(name, inst, exec) {
    instSet[name] = inst;
    execSet[name] = exec;
}
import './sets/alu.js';
import './sets/ram.js';
import './sets/jmp.js';
