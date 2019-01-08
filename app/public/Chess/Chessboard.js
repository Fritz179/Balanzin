const order = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

class Chessboard {
  constructor() {
    this.w = 80
    this.space = this.w * 0.05
    this.boardGraphic = createGraphics(round(this.w * 8 + this.space * 2), round(this.w * 8 + this.space * 2))
    this.board = []
    for (let x = 0; x < 8; x++) {
      this.board[x] = []
      for (let y = 0; y < 8; y++) {
        this.board[x][y] = new Piece(null, x, y)
      }
    }
    this.handPos = createVector(-1, -1)
    this.isWhiteTurn = true
    this.changed = true
    this.IAmWhite = true
  }

  draw() {
    if (this.changed) {
      console.log(`updating boardGraphic as: ${this.IAmWhite ? 'white' : 'black'}`);
      this.boardGraphic.push()
      this.boardGraphic.translate(this.space, this.space)
      this.changed = false
      this.boardGraphic.background(0)
      this.boardGraphic.noStroke()

      //draw checkerboard
      this.board.forEach((row, x) => {
        row.forEach((piece, y) => {
          (x + y) % 2 != 0 ? this.boardGraphic.fill(102, 51, 0) : this.boardGraphic.fill(204, 153, 0)
          this.boardGraphic.rect(x * this.w, y * this.w, this.w, this.w)
        })
      })

      // draw tiles
      this.board.forEach((row, x) => {
        row.forEach((piece, y) => {
          piece.draw(this.boardGraphic, this.IAmWhite)
        })
      })

      this.boardGraphic.pop()
    }

    image(this.boardGraphic, 0, 0)

    if (this.handPos.x != -1) {
      this.board[this.handPos.x][this.handPos.y].draw()
    }
  }

  mouseDragged() {

  }

  mousePressed() {
    if (!this.isMyTurn()) {
      return
    }

    let {x, y} = this.getMouseTile()

    //not on board
    if (x == -1 || y == -1) {
      return
    }

    const piece = this.board[x][y]

    if (!piece.name) {
      return
    }

    if (!this[`canMove${piece.isWhite ? 'White' : 'Black'}`]()) {
      return
    }

    if (!piece.getAllPossibleMoves().length) {
      return
    }

    if (piece.name) {
      piece.inHand = true
      this.handPos.set(x, y)
      this.changed = true
    }

    if (this.mousePressed_child) {
      this.mousePressed_child(x, y, piece)
    }

    return true
  }

  mouseReleased() {
    const {x, y} = this.getMouseTile()

    if (this.handPos.x == -1 || this.handPos.y == -1) {
      return
    }

    const piece = this.board[this.handPos.x][this.handPos.y]
    piece.inHand = false

    this.changed = true

    if (x == -1 || y == -1) {
      this.handPos.set(-1, -1)
      return
    }

    const {canMove, specialMove} = piece.getMoveTo(x, y)

    if (!canMove) {
      this.handPos.set(-1, -1)
      return
    }

    if (specialMove) {
      const {type, fromX, toX, y} = specialMove
      if (type  == 'castle') {
        this.movePiece(this.board[fromX][y], fromX, y, toX, y)
      }
    }

    if (typeof this.onMove == 'function') {
      this.onMove({
        from: {x: this.handPos.x, y: this.handPos.y},
        to: {x: x, y: y},
        specialMove: specialMove
      })
    }

    this.movePiece(piece, this.handPos.x, this.handPos.y, x, y)
    this.isWhiteTurn = !this.isWhiteTurn

    this.handPos.set(-1, -1)
  }

  getMouseTile() {
    let x = floor((mouseX - xOff) / this.w)
    let y = floor((mouseY - yOff) / this.w)

    this.IAmWhite ? y = 7 - y : x = 7 - x

    return isIn(x, y) ? {x: x, y: y} : {x: -1, y: -1}
  }

  isEmpty(x, y) {
    return isIn(x, y) && !this.board[x][y].name
  }

  startNewBoard () {
    this.board = []
    for (let x = 0; x < 8; x++) {
      this.board[x] = []
      for (let y = 0; y < 8; y++) {
        if (y == 1 || y == 6) {
          this.board[x][y] = new Piece('pawn', x, y, y == 1)
        } else if (y == 0 || y == 7) {
          this.board[x][y] = new Piece(order[x], x, y, y == 0)
        } else {
          this.board[x][y] = new Piece(null, x, y)
        }
      }
    }
    this.changed = true
  }

  move(move) {
    if (this.isEmpty(move.from.x, move.from.y)) {
      inpossibleMove('no piece')
      return
    }

    const piece = this.board[move.from.x][move.from.y]

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
        this.movePiece(this.board[fromX][y], fromX, y, toX, y)
      }
    }

    this.movePiece(this.board[move.from.x][move.from.y], move.from.x, move.from.y, move.to.x, move.to.y)
    this.isWhiteTurn = !this.isWhiteTurn

    this.changed = true
  }

  movePiece(piece, x1, y1, x2, y2) {
    if (this.board[x2][y2].name) {
      console.log('eated', this.board[x2][y2]);
      if (typeof this.onEated == 'function') {
        this.onEated(x2, y2)
      }
    }

    piece.firstMove = false
    piece.pos.set(x2, y2)
    this.board[x2][y2] = piece
    this.board[x1][y1] = new Piece(null, x1, y1)
  }

  isMyTurn() {
    return this.IAmWhite == this.isWhiteTurn
  }

  canMoveWhite() {
    return this.IAmWhite && this.isMyTurn()
  }

  canMoveBlack() {
    return !this.IAmWhite && this.isMyTurn()
  }
}

function isIn(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8
}
