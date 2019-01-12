if (typeof io == 'undefined') {
  throw new Error('No Server connection!')
}

const socket = io.connect('/chess/ai')

let board, pieces, xOff = 100, yOff = 100

function onload() {
  pieces = {}
  let toLoad = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'].forEach(piece => {
    pieces[piece] = {
      white: loadImage(`/public/chess/pieces/${piece}_white.png`),
      black: loadImage(`/public/chess/pieces/${piece}_black.png`)
    }
  })
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  board = new Chessboard(pieces)
  addMouseListener(board)

  socket.emit('getBoard')
  messagesPos(width / 3, height * 0.8)
}

function draw() {
  background(255)
  translate(xOff, yOff)
  board.draw()
  showMessages()
}

socket.on('update', update => {
  console.log(update);
  board.update(update)
})

socket.on('redirect', url => {
  if (window.parent != window) { //iframe
    window.parent.window.location.assign(url + window.parent.window.location.pathname)
  }
})

socket.on('log', data => {
  console.log(data);
})
