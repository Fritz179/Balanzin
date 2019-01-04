class Piece {
  constructor(name = null, x, y, isWhite = true) {
    this.name = name
    this.pos = createVector(x, y)
    this.isWhite = isWhite
    this.inHand = false
    this.firstMove = true
  }

  draw() {
    if (this.name) {
      if (this.inHand) {
        image(pieces[this.name][this.isWhite ? 'white' : 'black'], mouseX - this.w / 2 - xOff, mouseY - this.w / 2 - yOff, this.w, this.w)
      } else {
        image(pieces[this.name][this.isWhite ? 'white' : 'black'], this.pos.x * this.w, this.pos.y * this.w, this.w, this.w)
      }
    }
  }

  canMoveTo(x, y) {
    return this.getAllPossibleMoves().some(p => p.x == x && p.y == y)
  }

  getAllPossibleMoves() {
    let moves = []
    
    moves = this[`getAllPossibleMoves_${this.name}`](moves)

    return moves
  }

  getAllPossibleMoves_pawn() {
    const moves = []
    const {x, y} = this.pos
    const dir = this.isWhite ? 1 : -1

    if (isIn(x, y + dir)) {
      moves.push({x: x, y: y + dir})
    }
    if (this.firstMove && isIn(x, y + dir)) {
      moves.push({x: x, y: y + dir * 2})
    }

    if (isIn(x - 1, y + dir) && this.isEnemy(x - 1, y + dir)) {
      moves.push({x: x - 1, y: y + dir})
    }
    if (isIn(x + 1, y + dir) && this.isEnemy(x + 1, y + dir)) {
      moves.push({x: x + 1, y: y + dir})
    }

    return moves
  }

  getAllPossibleMoves_rook() {
    let moves = this.searcDir(1, 0)
    moves = moves.concat(this.searcDir(-1, 0))
    moves = moves.concat(this.searcDir(0, 1))
    moves = moves.concat(this.searcDir(0, -1))

    return moves
  }

  getAllPossibleMoves_knight() {
    const moves = []

    for (let x = -2; x < 3; x++) {
      if (x == 0) {
        continue
      } else if (x == -2 || x == 2) {
        for (let y = -1; y < 2; y += 2) {
          addSpot(this.pos.x + x, this.pos.y + y, this)
        }
      } else {
        for (let y = -2; y < 3; y += 4) {
          addSpot(this.pos.x + x, this.pos.y + y, this)
        }
      }
    }

    function addSpot(x, y, piece) {
      if (chessboard.isEmpty(x, y) || piece.isEnemy(x, y)) {
        moves.push({x: x, y: y})
      }
    }

    return moves
  }

  getAllPossibleMoves_bishop() {
    let moves = this.searcDir(1, 1)
    moves = moves.concat(this.searcDir(1, -1))
    moves = moves.concat(this.searcDir(-1, 1))
    moves = moves.concat(this.searcDir(-1, -1))

    return moves
  }

  getAllPossibleMoves_queen() {
    let moves = this.getAllPossibleMoves_rook()
    moves = moves.concat(this.getAllPossibleMoves_bishop())

    return moves
  }

  getAllPossibleMoves_king() {
    const moves = []

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (x == 0 && y == 0) {
          continue
        } else if (chessboard.isEmpty(this.pos.x + x, this.pos.y + y) || this.isEnemy(this.pos.x + x, this.pos.y + y)) {
          moves.push({x: this.pos.x + x, y: this.pos.y + y})
        }
      }
    }

    return moves
  }

  searcDir(xa, ya) {
    const {x, y} = this.pos
    const moves = []

    let i = 1, xn, yn, free = true
    while (free) {
      xn = x + xa * i
      yn = y + ya * i
      isIn(xn, yn) && chessboard.isEmpty(xn, yn) ? moves.push({x: xn, y: yn}) : free = false
      i++
    }

    if (isIn(xn, yn) && this.isEnemy(xn, yn)) {
      moves.push({x: xn, y: yn})
    }

    return moves
  }

  isEnemy(x, y) {
    return isIn(x, y) && chessboard.board[x][y].name && this.isWhite != chessboard.board[x][y].isWhite
  }

  get w() {
    return 80
  }
}
