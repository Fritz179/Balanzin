var cerchi = []
var w
var ws
var q = 1

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(51)

  /*
  if (windowWidth < windowHeight) {
    w = windowWidth
  } else {
    w = windowHeight
  }
  */

  let x = random(windowWidth)
  let y = random(windowHeight)
  cerchi[cerchi.length] = new circle(x, y)
}

function draw() {
  background(51)
  for (let i = 0; i < q; i++) {
    cerchi[cerchi.length - 1].ingrandisci()
  }
  for (let i = 0; i < cerchi.length; i++) {
    cerchi[i].mostra()
  }
}

function nuovo() {
  let xx = random(windowWidth)
  let yy = random(windowHeight)
  let temp = {
    x: xx,
    y: yy,
    r: 3
  }
  let buono = true
  for (let i = 0; i < cerchi.length; i++) {
    if (sopra(temp, cerchi[i])) {
      buono = false
    }
  }
  if (buono) {
    cerchi[cerchi.length] = new circle(xx, yy)
  } else {
    nuovo()
  }
}
