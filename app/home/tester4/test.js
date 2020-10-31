import WebGL from './webgl/webgl.js'

window.onload = async () => {
  const w = window.innerWidth, h = window.innerHeight
  const gl = new WebGL(w, h)
  const program = await gl.createProgram('./webgl/vert.glsl', './webgl/frag.glsl')

  await program.loadImage('./img.png')
  program.setUniform('u_MVP', [
    1 / w * 2, 0, 0, -1,
    0, -1 / h * 2, 0, 1,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])

  function render(timeStamp) {
    const t = timeStamp / 500
    const l = 200
    // const {floor, sin, cos} = Math
    // program.setUniform('u_Offset', [floor(sin(t) * l + l), floor(cos(t) * l + l)])

    x -= xv
    y -= yv
    program.setUniform('u_Offset', [x, y])
    program.clear(0, 1, 1)

    const s = 11 * 5
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        program.drawImage(x * s, y * s, s, s)
      }
    }

    const pos = Math.min(w, h) / 2 - s
    program.drawImage(pos - x, pos - y, s * 2, s * 2)

    program.render(true)

    window.requestAnimationFrame(render)
  }

  window.requestAnimationFrame(render)
}

import Keyboard from '/libraries/fritz_4/Keyboard.js'

let x= 0, xv = 0, y = 0, yv = 0, speed = 8;
Keyboard.onKeyDown(key => {
  switch (key) {
    case 'a': xv -= speed; break;
    case 's': yv += speed; break;
    case 'd': xv += speed; break;
    case 'w': yv -= speed; break;
  }
})

Keyboard.onKeyUp(key => {
  switch (key) {
    case 'a': xv += speed; break;
    case 's': yv -= speed; break;
    case 'd': xv -= speed; break;
    case 'w': yv += speed; break;
  }
})
