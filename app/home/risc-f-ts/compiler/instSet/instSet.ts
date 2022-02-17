import {instSet, execSet, inst, exec} from './emptySets.js'
export {instSet, execSet}

export function addOP(name: string, inst: inst, exec: exec) {
  instSet[name] = inst
  execSet[name] = exec
}

import './alu.js'
import './ram.js'
import './jmp.js'