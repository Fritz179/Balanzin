let video
let scl = 144
let t = 16 / 9

function setup() {
  createCanvas(windowWidth, windowHeight)
  video = createCapture(VIDEO)
  //video.size(scl, scl / t)
  video.hide()
}

function draw() {
  //image(video, 0, 0)

  video.loadPixels()
  /*
  let step = windowWidth / scl
  background(0)
  fill(255)
  rectMode(CENTER)
  for (var i = 0; i < video.pixels.length; i += 4) {
    //video.pixels[i + 0] = 255 - video.pixels[i + 0]
    //video.pixels[i + 1] = 255 - video.pixels[i + 1]
    //video.pixels[i + 2] = 255 - video.pixels[i + 2]
    //video.pixels[i + 3] = 30
    let m = (video.pixels[i + 0] + video.pixels[i + 1] + video.pixels[i + 2]) / 3
    let x = video.width - (i / 4) % video.width
    let y = (i / 4 - x) / video.width
    let q = m / 255
    rect(x * step, y * step, step * q, step * q)
  }
  */
  if (mouseIsPressed) {

    let a = (mouseX + mouseY * video.width) * 4
    console.log(video.pixels[a + 0], video.pixels[a + 1], video.pixels[a + 2])
    video.pixels[a] = 255
  }
  let ovo = false
  for (var i = 0; i < video.pixels.length; i += 4)  {
    if (video.pixels[i + 0] > 122 && video.pixels[i + 1] < 50 && video.pixels[i + 2] >  20) {
      ovo = true
      video.pixels[i + 0] = video.pixels[i + 2]
      video.pixels[i + 2] = video.pixels[i + 0]
    }
  }
  video.updatePixels()
  background(255)
  image(video, 0, 0)
  if (ovo) {
    fill(0)
    rect(0, 0, video.width, video.height)
  }

}
