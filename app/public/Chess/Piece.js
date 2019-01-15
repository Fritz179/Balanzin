function createChildBoard(board, move) {
  const childBoard = {}

  childBoard.pieces = board.pieces.slice()
  childBoard.castleRights = board.castleRights.slice()
  childBoard.isWhite = !board.isWhite
  childBoard.enPassant = 0

  if (move.flag) {
    if (move.flag == 'castle') {
      if (move.qs) {
        childBoard.pieces[move.to + 1] = childBoard.pieces[move.from - 4]
        childBoard.pieces[move.from - 4] = 0
      } else {
        childBoard.pieces[move.to - 1] = childBoard.pieces[move.from + 3]
        childBoard.pieces[move.from + 3] = 0
      }
    }
  }

  childBoard.pieces[move.to] = childBoard.pieces[move.from]
  childBoard.pieces[move.from] = 0

  return childBoard
}

const Moves = {
  getAllBoardMoves: board => {
    const moves = []

    board.pieces.forEach((piece, i) => {
      if (piece != 99 && piece != 0 && (piece > 0 ) == board.isWhite) {
        moves.push({moves: Moves[`getAllPieceMoves_${tiles[Math.abs(piece)]}`](board, i), from: i})
      }
    })

    return moves
  },

  getAllPieceMoves: (board, x, y) => {
    const i = (y + 2) * 10 + x + 1
    return Moves[`getAllPieceMoves_${tiles[Math.abs(board.pieces[i])]}`](board, i)
  },

  canPieceMoveTo: (board, from, to) => {
    const x1 = from % 8
    const y1 = (from - (from % 8)) / 8
    const x2 = to % 8
    const y2 = (to - (to % 8)) / 8
    from = (y1 + 2) * 10 + x1 + 1
    to = (y2 + 2) * 10 + x2 + 1
    return Moves[`getAllPieceMoves_${tiles[Math.abs(board.pieces[from])]}`](board, from).some(x => x.to == to)
  },

  movePiece: (board, move) => {
    const x1 = move.from % 8
    const y1 = (move.from - (move.from % 8)) / 8
    const x2 = move.to % 8
    const y2 = (move.to - (move.to % 8)) / 8
    const from = (y1 + 2) * 10 + x1 + 1
    const to = (y2 + 2) * 10 + x2 + 1

    auth = Moves[`getAllPieceMoves_${tiles[Math.abs(board.pieces[from])]}`](board, from).filter(x => x.to == to)[0]
    auth.from = from
    return createChildBoard(board, auth)
  },

  getAllPieceMoves_pawn: (board, index) => {
    const moves = []
    const dir = board.isWhite ? 10 : -10

    if (board.pieces[index + dir] == 0) {
      moves.push({to: index + dir})

      const rank = (index - index % 10) / 10
      if (dir == 10 ? rank == 3 : rank == 8) {
        if (board.pieces[index + dir * 2] == 0) {
          moves.push({to: index + dir * 2})
        }
      }
    }

    let toCheck = [index + dir + 1, index + dir - 1].forEach(i => {
      if (board.pieces[i] != 99 && board.pieces[i] != 0 && board.isWhite != Math.sign(board.pieces[i]) > 0) {
        moves.push({to: i})
      }
    })

    return moves
  },

  getAllPieceMoves_knight: (board, index) => {
    const moves = []

    let toCheck = [-21, -19, -12, -8, 8, 12, 19, 21].forEach(i => {
      let p = index + i
      if (board.pieces[p] == 0 || (board.pieces[p] != 99 && board.isWhite != Math.sign(board.pieces[p]) > 0)) {
        moves.push({to: p})
      }
    })

    return moves
  },

  getAllPieceMoves_bishop: (board, index) => {
    return Moves.searchDir(board, index, [-11, -9, 9, 11])
  },

  getAllPieceMoves_rook: (board, index) => {
    return Moves.searchDir(board, index, [-10, -1, 1, 10])
  },

  getAllPieceMoves_queen: (board, index) => {
    return Moves.searchDir(board, index, [-11, -9, 9, 11, -10, -1, 1, 10])
  },

  getAllPieceMoves_king: (board, index) => {
    const moves = []

    const toCheck = [-11, -10, -9, -1, 1, 9, 10, 11].forEach(i => {
      let p = index + i
      if (board.pieces[p] == 0 || (board.pieces[p] != 99 && board.isWhite != Math.sign(board.pieces[p]) > 0)) {
        moves.push({to: p})
      }
    })

    const toCheck2 = (board.isWhite ? [0, 1] : [2, 3]).forEach(dir => {
      if (board.castleRights[dir]) {
        if ((dir % 2 == 0 ? [-1, -2, -3] : [1, 2]).every(off => board.pieces[index + off] == 0)) {
          moves.push({to: index + (dir % 2 == 0 ? -2 : 2), flag: 'castle', qs: dir % 2 == 0})
        }
      }
    })

    return moves
  },

  searchDir: (board, index, dirs) => {
    const moves = []
    const sign = Math.sign(board.pieces[index])

    dirs.forEach(dir => {
      let current = index + dir

      while (board.pieces[current] == 0) {
        moves.push({to: current})
        current += dir
      }

      if (board.pieces[current] != 99 && sign != Math.sign(board.pieces[current])) {
        moves.push({to: current})
      }
    })

    return moves
  }
}

class Piece {
  constructor(name = null, x, y, isWhite = true) {
    this.name = name
    this.pos = createVector(x, y)
    this.isWhite = isWhite
    this.firstMove = true
  }

  draw(context, isWhite) {
    if (this.name) {
      if (isWhite) {
        context.image(pieces[this.name][this.isWhite ? 'white' : 'black'], this.pos.x * this.w, (7 - this.pos.y) * this.w, this.w, this.w)
      } else {
        context.image(pieces[this.name][this.isWhite ? 'white' : 'black'], (7 - this.pos.x) * this.w, this.pos.y * this.w, this.w, this.w)
      }
    }
  }

  drawHand() {
    image(pieces[this.name][this.isWhite ? 'white' : 'black'], mouseX - this.w / 2 - xOff, mouseY - this.w / 2 - yOff, this.w, this.w)
  }

  getMoveTo(x, y) {
    let output = {canMove: false, specialMove: null}

    this.getAllPossibleMoves().forEach(move => {
      if (move.x == x && move.y == y) {
        output = {canMove: true, specialMove: move.specialMove}
      }
    })

    return output
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

    if (chessboard.isEmpty(x, y + dir)) {
      moves.push({x: x, y: y + dir})
      if (this.firstMove && chessboard.isEmpty(x, y + dir * 2)) {
        moves.push({x: x, y: y + dir * 2})
      }
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

    if (this.firstMove) {
      checkCastle(0, this.pos.y, [1, 2, 3])
      checkCastle(7, this.pos.y, [5, 6])

      function checkCastle(x, y, toCheck) {
        if (!chessboard.isEmpty(x, y) && chessboard.pieces[y * 8 + x].firstMove) {
          if (toCheck.every(xx => chessboard.isEmpty(xx, y))) { //castle
            moves.push({x: x == 0 ? 2 : 6, y: y, specialMove: {
              type: 'castle',
              fromX: x,
              toX: x == 0 ? 3 : 5,
              y: y
            }})
          }
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
    return isIn(x, y) && chessboard.pieces[y * 8 + x] && this.isWhite != chessboard.pieces[y * 8 + x].isWhite
  }

  get w() {
    return 80
  }
}
