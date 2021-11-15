import entity from './entity.js'
import Camera from './Camera.js'
import timer from './timer.js'
import {loadLevel} from './loadImage.js'
import {createBackgroundLayer, createSpriteLayer} from './layers.js'
import {createMario} from './entities.js'
import {createCollisionLayer, createCameraLayer} from './layers.js'
import {setupKeyboard} from './input.js'
import {setupMouseControl} from './debug.js'

const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')
context.scale(3, 3)

window.addEventListener('resize', () => {
  // canvas.width = window.innerWidth
  // canvas.height = window.innerHeight

})

Promise.all([
  createMario(),
  loadLevel("1-1"),
]).then(([mario, level]) => {

  const camera = new Camera()
  window.camera = camera

  mario.pos.set(32, 160)
  level.entities.add(mario)

  const time = new timer(1 / 60)

  level.comp.layers.push(createCollisionLayer(level), createCameraLayer(camera))

  const input = setupKeyboard(mario, level)
  input.listenTo(window)

  setupMouseControl(canvas, mario, camera)

  time.update = function update(deltaTime) {
    level.update(deltaTime)

    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100
    }

    level.comp.draw(context, camera)
  }

  time.start()
  window.Matrix = Matrix
})

console.log("Press 'C' to activate debug mode");
