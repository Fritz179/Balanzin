if (typeof io == 'undefined') {
  throw new Error('No Server connection!')
}

const socket = connect('/home/block_racer')

let status = 'levelMenu'

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

socket.on('maxLevel', level => {
  app.maxLevel = level
})

class App {
  constructor() {
    this.maxLevel = 1
    this.game = new Game()
    this.levelMenu = new LevelMenu()
  }

  draw() {

  }
}

class LevelMenu {
  constructor() {
    
  }
}
