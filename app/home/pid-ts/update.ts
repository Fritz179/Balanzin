import timer from './timer.js'
import getInput from './getInput.js'
import {states} from './main.js'

let P = getInput('pValue', val => P = val)
let I = getInput('iValue', val => I = val)
let D = getInput('dValue', val => D = val)

let offset = getInput('offset', val => offset = val)

const maxSpeed = 0.01
const delay = 50

function measure(offset: number): number {
  return states[states.length - delay - offset].waterHeight
}

const wanted = 0.5
function pid(measured: number) {
  const err = wanted - measured

  const iSample = states.length - delay - (60 * 60)
  let integral = 0
  for (let i = 0; i < iSample; i++) {
    integral += wanted - measure(i)
  }
  // integral /= iSample

  const len = states.length
  let derivate = states[len - 10].error - err

  // console.log(err, integral, derivate)
  // console.log(err * P, integral * I, derivate * D)
  return err * P + integral * I + derivate * D
}

function step(opennes: number) {
  // const real = states[states.length - 1].waterHeight
  // let next = real + (opennes - 0.5) * 0.01
  // return next + offset

  const rate = 0.01
  const last = states[states.length - 1].waterHeight
  const waterHeight = last + offset * rate / 3

  const diff = Math.max(0, waterHeight - opennes)

  return waterHeight - diff * rate
}

function absClamp(value: number, max: number) {
  if (value > 0) return Math.min(value, max)
  return Math.max(value, -max)
}

timer.update = () => {
  const measured = measure(0)

  const pidErr = pid(measured)
  const err = absClamp(pidErr, maxSpeed)
  const opennes = (err + maxSpeed) / maxSpeed / 2

  const real = step(opennes)

  states.push({
    waterHeight: real,
    wantedHeight: 0.5,
    measured,
    error: err,
    klappeHeight: opennes
  })
}