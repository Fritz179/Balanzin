import {code, compiled} from '../compiler/parser.js'

export interface value {
  value: number,  // hardware value
  creator: code   // who wrote this value, useful for debugging?
  line?: code,    // used for simulation, has opcode resolver
}

interface register {
  [key: string]: value
}

export default class Machine {
  eeprom: value[]
  ram: value[]
  registers: register
  currActions: [string, value][]
  prevActions: [string, value][][]
  running: boolean
  flags: number
  steps: number

  constructor() {

  }
}