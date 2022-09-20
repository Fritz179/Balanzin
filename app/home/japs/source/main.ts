// npx tsc ./source/main.ts --outDir ./out --module es2022 --target es2022 --strict --strictNullChecks --forceConsistentCasingInFileNames --skipLibCheck -w

import Timer from './Timer.js'
import JAPS from './JAPS/JAPS.js'

const japs = new JAPS(window.innerWidth, window.innerHeight)

function update() {
  japs.update()
}

function render() {
  japs.render()
}

window.addEventListener('click', (e) => {
  japs.mouseClick(e.x, e.y, e)
})

window.addEventListener('mousemove', (e) => {
  japs.mouseMove(e.x, e.y, e)
})

window.addEventListener('keydown', (e) => {
  japs.key(e.key)
})

const timer = new Timer(60, update, render)
timer.start()