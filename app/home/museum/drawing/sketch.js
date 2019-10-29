let status
let drawing
let sS
let escape

function preload() {
  sS = new SS()
}

function setup() {
  sS.sounds.mouseOver.play()
  createCanvas(windowWidth, windowHeight)
  pixelDensity(1)
  background(255);

  drawing = new Drawing()
  escape = new Escape()

  changeStatus("escape", [21, 21, 5, 10, 1], true)
}

function mousePressed() {
  if (eval(status + ".mousePressed")) {
    eval(status + ".mousePressed(mouseX, mouseY)")
  }
  //drawing.mousePressed(mouseX, mouseY)
}

function touchStarted() {
  if (eval(status + ".mousePressed")) {
    eval(status + ".mousePressed(mouseX, mouseY)")
  }
  //drawing.mousePressed(mouseX, mouseY)
}

function mouseReleased() {
  if (eval(status + ".mouseReleased")) {
    eval(status + ".mouseReleased(mouseX, mouseY)")
  }
  //drawing.mouseReleased(mouseX, mouseY)
}

function draw() {
  if (eval(status + ".mostra")) {
    eval(status + ".mostra()")
  }
  //drawing.mostra()
}

function keyPressed() {
  if (eval(status + ".keyPressed")) {
    eval(status + ".keyPressed(keyCode)")
  }
  //drawing.keyPressed(keyCode)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  if (eval(status + ".updateSize")) {
    eval(status + ".updateSize()")
  }
  //drawing.updateSize()
}

function changeStatus(temp, info, home = false) {
  if (status) {
    eval(status + ".end()")
  }
  status = temp
  console.log(status, info, home)
  eval(status + ".start(info, home)")
}
