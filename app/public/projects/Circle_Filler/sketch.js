let circles = []
let validPos = []
var speed = 1

function setup() {
  insertNav()
  changeTitle('Cerchi!')
  insertSlider('Speed: ', 1, 100, 1, 2, input => speed = input.value)
  insertP('Pixels left: ', 'updatePixelsCount')
  insertButton('Restart', restartButtonPressed)

  createCanvas(window.innerWidth, window.innerHeight)
  background(51)
  let min = 4
  for (let x = min; x < width - min; x++) {
    for (let y = min; y < height - min; y++) {
      validPos.push({x: x, y: y})
    }
  }

  circles.push(new Circle(random(validPos)))
}

function draw() {
  background(51)
  for (let i = 0; i < speed; i++) {
    circles[circles.length - 1].update()
  }
  options.updatePixelsCount(validPos.length)
  for (let i = 0; i < circles.length; i++) {
    circles[i].mostra()
  }
}

function restartButtonPressed() {
  circles.splice(0, circles.length - 1)
  validPos = []
  let min = 4
  for (let x = min; x < width - min; x++) {
    for (let y = min; y < height - min; y++) {
      validPos.push({x: x, y: y})
    }
  }
  loop()
}
