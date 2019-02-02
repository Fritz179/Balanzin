if (typeof io == 'undefined') {
  throw new Error('No Server connection!')
}

const socket = connect('/home/block_racer')

let status = 'levelMenu', app

function setup() {
  app = new App()
  createCanvas(window.innerWidth, window.innerHeight)
  socket.emit('ready')
}

function draw() {
  background(51)
  app[status].draw()

  showMessages()
}

function mousePressed() {
  if (typeof app[status].mousePressed == 'function') {
    app[status].mousePressed()
  }
}

function keyPressed() {
  if (typeof app[status].keyPressed == 'function') {
    app[status].keyPressed()
  }
}

socket.on('info', info => {
  app.unlockedLevel = info.unlockedLevel
  console.log(app);
})

class App {
  constructor() {
    this.unlockedLevel = 0
    this.game = new Game()
    this.levelMenu = new LevelMenu()
  }

  draw() {

  }
}

class LevelMenu {
  constructor() {

  }

  draw() {
    textAlign(CENTER, CENTER)
    textSize(40)
    const w = width / 8
    const s = w / 4
    for (let i = 0; i < 10; i++) {
      i <= app.unlockedLevel ? fill(243, 156, 18) : fill(153, 163, 164)
      const x = i % 8
      const y = (i - x) / 8
      if (mouseIsOver(x * w + s, y * w + s, w - 2 * s, w - 2 * s) && i <= app.unlockedLevel) {
        rect(x * w + s / 2, y * w + s / 2, w - s, w - s)
      } else {
        rect(x * w + s, y * w + s, w - 2 * s, w - 2 * s)
      }
      fill(0)
      text(i, x * w + w / 2, y * w + w / 2)
    }
  }

  mousePressed() {
    const w = width / 8
    const s = w / 4
    const x = floor(mouseX / w)
    const y = floor(mouseY / w)

    if (mouseIsOver(x * w + s, y * w + s, w - 2 * s, w - 2 * s)) {
      const i = y * 8 + x
      if (i <= app.unlockedLevel) {
        app.currentLevel = i
        loadJSON(`./levels/level_${i}.json`, this.startGame)
      }
    }
  }

  startGame(level) {
    app.game.loadLevel(level)
    status = 'game'
  }
}

function mouseIsOver(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h
}
