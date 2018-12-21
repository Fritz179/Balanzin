let fritzs = []
let count = 0
let speedSlider

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function setup() {
  createCanvas(windowWidth, windowHeight)

                      //x,   y,   w,    q,  s,  toDisplay = '',  r
  fritzs.push(new Fritz(50,  500, 1200, 14, 50, 'abcdefhilnopru'  ))
  fritzs.push(new Fritz(100, 300, 1050, 11, 50, '-0123456789',   8))
  fritzs.push(new Fritz(100, 100, 1000, 10, 50, '0000000000',    8))
  fritzs.push(new Fritz(100, 800, 500,  5,  50, 'error',         6))

  speedSlider = createSlider(0.05, 10, 1, 0.1)
  speedSlider.position(50, 700)

}

function draw() {
  background(51);

  fritzs[2].display(Math.round(count))

  fritzs.forEach(fritz => {
    fritz.update()
  })

  count += speedSlider.value()

  line(0, 0, windowWidth, windowHeight)
  line(0, 0, width, height)
}
