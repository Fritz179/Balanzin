const order = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

class Chessboard {
  constructor() {
    this.board = []
    for (let x = 0; x < 8; x++) {
      this.board[x] = []
      for (let y = 0; y < 8; y++) {
        this.board[x][y] = new Piece(null, x, y)
      }
    }
    this.w = 80
    this.handPos = createVector(-1, -1)
    this.isWhiteTurn = true
  }

  draw() {
    fill(255)
    stroke(0)
    strokeWeight(10)
    rect(0, 0, this.w * 8, this.w * 8)
    noStroke()
    this.board.forEach((row, x) => {
      row.forEach((piece, y) => {
        (x + y) % 2 != 0 ? fill(102, 51, 0) : fill(204, 153, 0)
        rect(x * this.w, y * this.w, this.w, this.w)

        piece.draw()
      })
    })
    if (this.handPos.x != -1) {
      this.board[this.handPos.x][this.handPos.y].draw()
    }
  }

  update(update) {
    if (typeof update == 'string') {
      Chessboard[update](this)
    } else {
      update.tiles.forEach(tile => {
        this.board[tile.x][tile.y] = tile.newTile
      })
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

    if (x == -1 || y == -1) {
      return
    }

    if (!piece.canMoveTo(x, y)) {
      return
    }

    if (this.board[x][y].name) {
      console.log('eated', this.board[x][y]);
    }

    piece.firstMove = false
    piece.pos.set(x, y)
    this.board[x][y] = piece
    this.board[this.handPos.x][this.handPos.y] = new Piece(null, x, y)

    this.isWhiteTurn = !this.isWhiteTurn
    this.handPos.set(-1, -1)
  }

  getMouseTile() {
    const x = floor((mouseX - xOff) / this.w)
    const y = floor((mouseY - yOff) / this.w)

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

    if (!piece.canMoveTo(move.to.x, move.to.y)) {
      inpossibleMove('Not able to move there')
      return
    }

    if (this.board[move.to.x][move.to.y].name) {
      console.log('eated', this.board[move.to.x][move.to.y]);
    }

    piece.firstMove = false
    piece.pos.set(move.to.x, move.to.y)
    this.board[move.to.x][move.to.y] = piece
    this.board[move.from.x][move.from.y] = new Piece(null, move.from.x, move.from.y)

    this.isWhiteTurn = !this.isWhiteTurn

    function inpossibleMove(reason) {
      console.log(move, 'cannot be performes because: ' + reason);
    }
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
