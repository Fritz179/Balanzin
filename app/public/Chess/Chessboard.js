const order = ['empty', 'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook', 'empty']
const tiles = {pawn: 1, knight: 2, bishop: 3, rook: 4, queen: 5, king: 6, empty: 0, out: 99}
Object.keys(tiles).forEach(key => {
  tiles[tiles[key]] = key
})

class Chessboard {
  constructor() {
    this.w = 80
    this.board = createStartingBoard()
    this.chessboard = createChessboard(this.board)
    this.chessboardGraphic = createGraphics(this.w * 8, this.w * 8)
    this.checkerboard = createGraphics(this.w * 8, this.w * 8)
    this.checkerboard.noStroke()
    this.isWhiteTurn = true
    this.changed = true
    this.whiteBoard = true

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        (x + y) % 2 != 0 ? this.checkerboard.fill(102, 51, 0) : this.checkerboard.fill(204, 153, 0)
        this.checkerboard.rect(x * this.w, y * this.w, this.w, this.w)
      }
    }
  }

  draw() {
    if (this.changed) {
      this.changed = false
      console.log(`updating boardGraphic as: ${this.whiteBoard ? 'white' : 'black'}`);

      this.chessboardGraphic.image(this.checkerboard, 0, 0)
      Object.keys(this.chessboard).filter(key => key != 'hand').forEach(key => {
        let piece = this.chessboard[key]
        let x = this.whiteBoard ? piece.x * this.w : (7 - piece.x) * this.w
        let y = this.whiteBoard ? (7 - piece.y) * this.w : piece.y * this.w
        this.chessboardGraphic.image(pieces[piece.name][piece.isWhite ? 'white' : 'black'], x, y, this.w, this.w)
      })
    }

    image(this.chessboardGraphic, 0, 0)
    if (this.chessboard.hand) {
      let x = mouseX - this.w / 2 - xOff
      let y = mouseY - this.w / 2 - yOff
      image(pieces[this.chessboard.hand.name][this.chessboard.hand.isWhite ? 'white' : 'black'], x, y, this.w, this.w)
    }
  }

  mouseDragged() {

  }

  mousePressed() {
    if (!this.isMyTurn()) {
      showMessage('danger', "Wait your turn!")
      return
    }

    let {x, y} = this.getMouseTile()

    //not on board
    if (x == -1 || y == -1) {
      return
    }

    const piece = this.chessboard[y * 8 + x]

    if (!piece) {
      return
    }

    if (!this[`canMove${piece.isWhite ? 'White' : 'Black'}`]()) {
      showMessage('danger', "Wrong color")
      return
    }

    if (!Moves.getAllPieceMoves(this.board, x, y).length) {
      showMessage('danger', 'Piece unable to move!')
      return
    }


    delete this.chessboard[y * 8 + x]
    this.chessboard.hand = piece
    this.changed = true

    if (this.mousePressed_child) {
      console.log('calling mousePressed_child');
      this.mousePressed_child(x, y, piece)
    }

    return true
  }

  mouseReleased() {
    const {x, y} = this.getMouseTile()

    if (!this.chessboard.hand) {
      return
    }

    this.chessboard[this.chessboard.hand.y * 8 + this.chessboard.hand.x] = this.chessboard.hand
    this.changed = true

    const move = {to: y * 8 + x, from: this.chessboard.hand.y * 8 + this.chessboard.hand.x}
    const err = this.move(move)
    if (err) {
      showMessage('danger', err)
    } else if (typeof this.onMove == 'function') {
      this.onMove(move)
    }

    delete this.chessboard.hand
  }

  getMouseTile() {
    let x = floor((mouseX - xOff) / this.w)
    let y = floor((mouseY - yOff) / this.w)

    this.whiteBoard ? y = 7 - y : x = 7 - x

    return isIn(x, y) ? {x: x, y: y} : {x: -1, y: -1}
  }

  move(move) {
    if (!this.chessboard[move.from] || move.to < 0 || move.to > 63 || move.from < 0 || move.from > 63) {
      return 'Invalid Pos'
    }

    const piece = this.chessboard[move.from]

    if (this.isWhiteTurn != piece.isWhite) {
      return 'Wrong color'
    }

    if (!Moves.canPieceMoveTo(this.board, move.from, move.to)) {
      return 'Cannot move there'
    }

    this.board = Moves.movePiece(this.board, move)
    this.chessboard = createChessboard(this.board)
    this.isWhiteTurn = this.board.isWhite

    this.changed = true
  }

  isMyTurn() {
    return this.whiteBoard == this.isWhiteTurn
  }

  canMoveWhite() {
    return this.whiteBoard && this.isMyTurn()
  }

  canMoveBlack() {
    return !this.whiteBoard && this.isMyTurn()
  }

  setColor(isWhite) {
    this.whiteBoard = isWhite
    this.changed = true
  }
}

function isIn(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8
}

function createStartingBoard() {
  startingBoard = {}

  startingBoard.pieces = []
  for (let i = 0; i < 120; i++) {
    let x = i % 10
    let y = (i - x) / 10

    if (x > 0 && x < 9 && y > 1 && y < 10) {
      if (y == 3 || y == 8) {
        startingBoard.pieces[i] = y == 3 ? 1 : -1
      } else if (y == 2 || y == 9) {
        startingBoard.pieces[i] = y == 2 ? tiles[order[x]] : -tiles[order[x]]
      } else {
        startingBoard.pieces[i] = 0
      }
    } else {
      startingBoard.pieces[i] = 99
    }
  }

  startingBoard.isWhite = true
  startingBoard.enPassant = 0
  startingBoard.castleRights = [true, true, true, true] //wqs, wks, bqs, bks

  return startingBoard
}

function createChessboard(board) {
  const chessboard = {}

  board.pieces.forEach((piece, i) => {
    if (piece != 99 && piece != 0) {
      const x = i % 10 - 1
      const y = (i - i % 10) / 10 - 2
      chessboard[y * 8 + x] = {name: tiles[Math.abs(piece)], isWhite: piece > 0, x: x, y: y}
    }
  })

  return chessboard
}
