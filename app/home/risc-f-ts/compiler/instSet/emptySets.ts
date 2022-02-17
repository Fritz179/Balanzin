export type inst = (...ops: (number | string)[]) => number[]
export type exec = (...ops: (number | string)[]) => void

interface instSet {
  [key: string]: inst
}

interface execSet {
  [key: string]: exec
}

const instSet: instSet = {}
const execSet: execSet = {}
export {instSet, execSet}

