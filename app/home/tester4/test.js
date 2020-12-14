import WebGL from './webgl/webgl.js'

window.onload = async () => {
  const w = window.innerWidth, h = window.innerHeight
  const gl = new WebGL(w, h)
  const program = await gl.createProgram('./webgl/vert.glsl', './webgl/frag.glsl')
  const program2 = await gl.createProgram('./webgl/vert.glsl', './webgl/frag2.glsl')

  gl.useProgram(program);
  await program.loadImage('./img.png')
  program.setUniform('u_MVP', [
    1 / w * 2, 0, 0, -1,
    0, -1 / h * 2, 0, 1,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])

  gl.gl.enable(gl.gl.DEPTH_TEST);
  gl.gl.depthFunc(gl.gl.LEQUAL);

  gl.useProgram(program2);
  await program2.loadImage('./img.png')
  program2.setUniform('u_MVP', [
    1 / w * 2, 0, 0, -1,
    0, -1 / h * 2, 0, 1,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])

  const playerView = program.getQuad()
  function render(timeStamp) {
    const t = timeStamp / 500
    const l = 200

    x -= xv
    y -= yv
    gl.useProgram(program);
    program.setUniform('u_Offset', [x, y])
    program.clear(0, 1, 1)

    const s = 11 * 5
    const o = 10 * 5
    for (let x = 0; x < 11; x++) {
      for (let y = 0; y < 10; y++) {
        program.drawImage(x * o, y * s, s, s)
      }
    }

    const pos = Math.min(w, h) / 2 - s
    playerView(pos - x, pos - y, s * 2, s * 2, -1)

    program.render(true)

    gl.useProgram(program2);
    program2.setUniform('u_Offset', [x, y])
    program2.drawImage(pos - x + 100, pos - y, s * 2, s * 2)
    program2.render(true)

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
