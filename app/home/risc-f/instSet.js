import {assertRegisters} from './assert.js'

const add = (d, a, b) => {
  if (!b) b = a
  const registers = assertRegisters(a, b, d)

  return [registers]
}

const ldi = (d, val) => {
  return [10]
}

const mov = (d, a) => {
  return [12]
}

const jmp = (to) => {
  return [55, 14]
}

const allInsts = [add, ldi, mov, jmp]

const instSet = {}
allInsts.forEach(inst => {
  instSet[inst.name] = inst
})

export default instSet
