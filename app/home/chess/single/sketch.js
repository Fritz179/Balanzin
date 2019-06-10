let chessboard, pieces
let xOff = 100, yOff = 100

function onload() {
  pieces = {}
  let toLoad = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'].forEach(piece => {
    pieces[piece] = {
      white: loadImage(`../pieces/${piece}_white.png`),
      black: loadImage(`../pieces/${piece}_black.png`)
    }
  })
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  chessboard = new SingleChessboard()
  addMouseListener(chessboard)
  messagesPos(width / 3, height * 0.8)
}

function draw() {
  background(255)
  translate(xOff, yOff)
  chessboard.draw()
  showMessages()
}

function touchStarted() {
  background(255, 0, 0)
  return chessboard.mousePressed()
}

function touchMoved() {
  if (chessboard.pieces.hand) {
    background(0, 255, 0)
    return false
  }
}

function touchEnded() {
  const toPrevent = chessboard.mouseReleased()
  background(0, 0, 255)

  if (toPrevent) {
    return false
  }
}
