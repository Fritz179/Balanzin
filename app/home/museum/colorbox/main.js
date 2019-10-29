let status
let game
let sS
let escape

function preload() {
  sS = new SS()
  escape = new Escape()
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(1)
  background(255);

  game = new Game()

  sS.play("start1")
  changeStatus("escape", "home", [])
}

function mousePressed() {
  if (eval(status + ".mousePressed")) {
    eval(status + ".mousePressed(mouseX, mouseY)")
  }
}

function mouseReleased() {
  if (eval(status + ".mouseReleased")) {
    eval(status + ".mouseReleased(mouseX, mouseY)")
  }
}

function draw() {
  if (eval(status + ".mostra")) {
    eval(status + ".mostra()")
  }
}

function keyPressed() {
  if (eval(status + ".keyPressed")) {
    eval(status + ".keyPressed(keyCode)")
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  if (eval(status + ".updateSize")) {
    eval(status + ".updateSize()")
  }
}

function changeStatus(toChange, type, info) {
  if (status) {
    eval(status + ".end()")
  }
  status = toChange
  console.log(status, type, info)
  eval(status + ".start(type, info)")
}
