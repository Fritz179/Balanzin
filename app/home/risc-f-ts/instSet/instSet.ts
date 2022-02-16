import {instSet, execSet, inst, exec} from './sets/emptySets.js'
export {instSet, execSet}

export function addOP(name: string, inst: inst, exec: exec) {
  instSet[name] = inst
  execSet[name] = exec
}

import './sets/alu.js'
import './sets/ram.js'
import './sets/jmp.js'