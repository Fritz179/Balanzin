// npx tsc ./main.ts --outDir ../pid --module es2020 --target es2020 --strict --strictNullChecks --forceConsistentCasingInFileNames -w

export interface state {
  waterHeight: number,
  wantedHeight: number,
  klappeHeight: number,
  measured: number,
  error: number
}

import timer from './timer.js'

timer.load = async () => {
  await import('./render.js')
  await import('./update.js')

  const graph = document.getElementById('graph')! as HTMLCanvasElement
  graph.width = 800
  graph.height = 400

  const drawing = document.getElementById('drawing')! as HTMLCanvasElement
  drawing.width = 800
  drawing.height = 400
}

export const states:state[] = []
for (let i = 0; i < 60 * 60; i++) {
  states.push({
    waterHeight: 0.01,
    wantedHeight: 0.01,
    measured: 0,
    error: 0,
    klappeHeight: 0,
  })
}


let save = states.length
window.addEventListener('keydown', e => {
  if (e.key == ' ') {
    timer.toggle()
  }

  if (e.key == 's') {
    save = states.length
  }

  if (e.key == 'd') {
    states.splice(save)
  }
})