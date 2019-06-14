if (typeof io == 'undefined') {
  throw new Error('No Server connection!')
}

const socket = connect('/chess/player/play')

let chessboard, pieces
let xOff = 100, yOff = 100

function onload() {
  pieces = {}
  let toLoad = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'].forEach(piece => {
    pieces[piece] = {
      white: loadImage(`../../pieces/${piece}_white.png`),
      black: loadImage(`../../pieces/${piece}_black.png`)
    }
  })
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  chessboard = new PlayerChessboard()
  addMouseListener(chessboard)
  socket.emit('loaded')
  messagesPos(width / 3, height * 0.8)
}

function draw() {
  background(255)
  translate(xOff, yOff)
  chessboard.draw()
  showMessages()
}

socket.on('update', update => {
  clearMessage()
  const {key, data} = update
  console.log(update);
  if (typeof chessboard[key] == 'function') {
    chessboard[key](data)
  } else {
    console.warn('update not found: ' + key);
  }
})

socket.on('reloadBoard', board => {
  chessboard.reloadBoard(board)
})

socket.on('move', move => {
  chessboard.move(move)
})

function touchStarted() {
  background(255, 0, 0)
  return chessboard.mousePressed()
}

function touchMoved() {
  if (chessboard.handPos.x != -1) {
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
