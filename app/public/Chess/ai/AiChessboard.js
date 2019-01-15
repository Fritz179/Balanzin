class AiChessboard extends Chessboard {
  constructor() {
    super()
  }

  onMove(move) {
    let bestValue = -999
    let bestMove
    Moves.getAllBoardMoves(this.board).forEach(piece => {
      piece.moves.forEach(move => {
        move.from = piece.from
        let val = -negaMax(createChildBoard(this.board, move), 1, this.isWhite ? -1 : 1)
        if (val > bestValue) {
          bestValue = val
          bestMove = move
        }
      })
    })

    this.board = createChildBoard(this.board, bestMove)
    this.chessboard = createChessboard(this.board)
    this.isWhiteTurn = this.board.isWhite
    showMessage('success', "It's your turn!")

    this.changed = true
  }
}

function negaMax(board, depth, color) {
  if (depth > 4) { //is terminal noe
    return color * evaluation(board)
  }

  let bestValue = -999
  Moves.getAllBoardMoves(board).forEach(piece => {
    piece.moves.forEach(move => {
      move.from = piece.from
      let val = -negaMax(createChildBoard(board, move), depth + 1, -color)
      bestValue = val > bestValue ? val : bestValue
    })
  })

  return bestValue
}

function evaluation(board) {
  let val = 0
  // console.log(board);
  board.pieces.forEach(piece => {
    if (piece != 99) {
      val += piece
    }
  })

  return val
}
