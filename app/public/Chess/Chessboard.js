const order = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
const tilesToCheck = []

class Chessboard {
  constructor() {
    this.w = 80
    this.chessboard = createGraphics(this.w * 8, this.w * 8)
    this.checkerboard = createGraphics(this.w * 8, this.w * 8)
    this.checkerboard.noStroke()
    this.isWhiteTurn = true
    this.changed = true
    this.whiteBoard = true

    this.pieces = {}
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (y == 1 || y == 6) {
          this.pieces[y * 8 + x] = new Piece('pawn', x, y, y == 1)
        } else if (y == 0 || y == 7) {
          this.pieces[y * 8 + x] = new Piece(order[x], x, y, y == 0)
          if (order[x] == 'king') {
            this.pieces[(y == 0 ? 'white' : 'black') + 'King'] = this.pieces[y * 8 + x]
          }
        }
        (x + y) % 2 != 0 ? this.checkerboard.fill(102, 51, 0) : this.checkerboard.fill(204, 153, 0)
        this.checkerboard.rect(x * this.w, y * this.w, this.w, this.w)
      }
    }
    console.log(this.pieces);
  }

  draw() {
    if (this.changed) {
      this.changed = false
      console.log(`updating boardGraphic as: ${this.whiteBoard ? 'white' : 'black'}`);

      this.chessboard.image(this.checkerboard, 0, 0)
      Object.keys(this.pieces).filter(key => key != 'hand').forEach(key => {
        this.pieces[key].draw(this.chessboard, this.whiteBoard)
      })
    }

    image(this.chessboard, 0, 0)
    if (this.pieces.hand) {
      this.pieces.hand.drawHand()
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

    const piece = this.pieces[y * 8 + x]

    if (!piece) {
      return
    }

    if (!this[`canMove${piece.isWhite ? 'White' : 'Black'}`]()) {
      showMessage('danger', "Wrong color")
      return
    }

    if (!piece.getAllPossibleMoves().length) {
      showMessage('danger', 'Piece unable to move!')
      return
    }

    if (piece.name) {
      delete this.pieces[y * 8 + x]
      this.pieces.hand = piece
      this.changed = true
    }

    if (this.mousePressed_child) {
      this.mousePressed_child(x, y, piece)
    }

    return true
  }

  mouseReleased() {
    const {x, y} = this.getMouseTile()

    if (!this.pieces.hand) {
      return
    }

    const piece = this.pieces.hand

    this.changed = true

    if (x == -1 || y == -1) {
      showMessage('danger', 'Invalid Position!')
      this.pieces[this.pieces.hand.pos.y * 8 + this.pieces.hand.pos.x] = this.pieces.hand
      delete this.pieces.hand
      return
    }

    const {canMove, specialMove} = piece.getMoveTo(x, y)

    if (!canMove) {
      showMessage('danger', "Cannot move there!")
      this.pieces[this.pieces.hand.pos.y * 8 + this.pieces.hand.pos.x] = this.pieces.hand
      delete this.pieces.hand
      return
    }

    if (specialMove) {
      const {type, fromX, toX, y} = specialMove
      showMessage('success', type)
      if (type  == 'castle') {
        this.movePiece(this.pieces[y * 8 + fromX], fromX, y, toX, y)
      }
    }

    if (typeof this.onMove == 'function') {
      console.log('onMove');
      this.onMove({
        from: {x: this.pieces.hand.pos.x, y: this.pieces.hand.pos.y},
        to: {x: x, y: y},
        specialMove: specialMove
      })
    }
    this.movePiece(piece, this.pieces.hand.pos.x, this.pieces.hand.pos.y, x, y)
    this.isWhiteTurn = !this.isWhiteTurn

    delete this.pieces.hand
  }

  getMouseTile() {
    let x = floor((mouseX - xOff) / this.w)
    let y = floor((mouseY - yOff) / this.w)

    this.whiteBoard ? y = 7 - y : x = 7 - x

    return isIn(x, y) ? {x: x, y: y} : {x: -1, y: -1}
  }

  isEmpty(x, y) {
    return isIn(x, y) && !this.pieces[y * 8 + x]
  }

  move(move) {
    if (this.isEmpty(move.from.x, move.from.y)) {
      inpossibleMove('no piece')
      return
    }

    const piece = this.pieces[move.from.y * 8 + move.from.x]

    if (this.isWhiteTurn != piece.isWhite) {
      inpossibleMove('Wrong color')
      return
    }

    const {canMove, specialMove} = piece.getMoveTo(move.to.x, move.to.y)

    if (!canMove) {
      inpossibleMove('Not able to move there')
      return
    }

    function inpossibleMove(reason) {
      console.log(move, 'cannot be performes because: ' + reason);
    }

    if (specialMove) {
      const {type, fromX, toX, y} = specialMove
      if (type  == 'castle') {
        this.movePiece(this.pieces[y * 8 + fromX], fromX, y, toX, y)
      }
    }

    this.movePiece(this.pieces[move.from.y * 8 + move.from.x], move.from.x, move.from.y, move.to.x, move.to.y)
    this.isWhiteTurn = !this.isWhiteTurn

    this.changed = true
  }

  movePiece(piece, x1, y1, x2, y2) {
    if (this.pieces[y2 * 8 + x2]) {
      console.log('eated', this.pieces[y2 * 8 + x2]);
      if (typeof this.onEated == 'function') {
        this.onEated(x2, y2)
      }
    }

    piece.firstMove = false
    piece.pos.set(x2, y2)
    this.pieces[y2 * 8 + x2] = piece
    delete this.pieces[y1 * 8 + x1]
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
}

function isIn(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8
}


function createBoard(board, move) {
  this.pieces = {}
  Object.assign(this.pieces, board.pieces)
  this.whiteTurn = board.whiteTurn
  this.enPassant = board.enPassant
  this.castleRights = board.castleRights

  if (move.flag) {
    //TODO
  } else {
    this.pieces[move.to] = this.pieces[move.from]
    delete this.pieces[move.from]
  }
}

createStartingBoard()

function createStartingBoard() {
  const board = []
  const order = [4, 2, 3, 5, 6, 3, 2, 4]

  for (let i = 0; i < 120; i++) {
    let x = i % 10 - 1
    let y = (i - i % 10) / 10 - 2

    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      tilesToCheck.push(i)
      if (y == 1 || y == 6) {
        board[i] = y == 1 ? 1 : -1
      } else if (y == 0 || y == 7) {
        board[i] = y == 0 ? order[x] : -order[x]
      } else  {
        board[i] = 0
      }
    } else {
      board[i] = 7
    }
  }

  board[120] = false //isWhite
  board[121] = 0 //enPassantColum

  return board
}
