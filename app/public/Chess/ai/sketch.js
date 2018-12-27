const socket = io.connect('/chess/ai')
let board, pieces

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
}

function draw() {
  translate(100, 100)
  board.draw()
}

socket.on('update', updates => {
  board.update(updates)
})

socket.on('ready', () => {
  console.log('Connection established');
})

socket.on('redirect', url => {
  if (window.parent != window) { //iframe
    window.parent.window.location.assign(url + window.parent.window.location.pathname)
  }
})

socket.on('log', data => {
  console.log(data);
})
