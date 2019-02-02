let max = 0, ym, s = 2, d = 1, speed = 1

function setup() {
  insertTitle('Sinus!')
  insertSlider('Sinus: ', 0.1, 5, 0.01, 2, e => d = e.value)
  insertSlider('Scale: ', 0.5, 5, 0.01, 2, e => s = e.value)
  insertSlider('Speed: ', 0.1, 10, 0.1, 2, e => speed = parseFloat(e.value))

  createCanvas(window.innerWidth, window.innerHeight)
  angleMode(DEGREES)
  ym = window.innerHeight / 2
}

function draw() {
  background(51)

  noFill()
  stroke(255)
  ellipse(125 * s, ym, 200 * s)
  stroke(0)
  line(250 * s, ym, width, ym)
  stroke(245, 176, 65)

  for (let x = 0; x < max; x++) {
    const y = sin(x / d) * 100 * s
    // line(x - speed, sin((x - speed) / d) * 100 * s, x, y + ym)
    point((x + 250) * s, ym - y)
  }

  const y = ym - sin(max / d) * 100 * s
  const x = cos(max / d) * 100 * s
  stroke(0)
  fill(255, 0, 0)
  line(x + 125 * s, y, (max + 250) * s, y)
  ellipse((max + 250) * s, y, 10 * s)
  ellipse(x + 125 * s, y, 10 * s)
  // console.log(yc);

  max += speed
  if ((max + 250) * s > width) {
    max = 0
  }
  showMessages()
}
