class AiChessboard extends Chessboard {
  constructor() {
    super()
  }

  onMove(move) {
    let bestValue = -99999
    let bestMove
    const n = Date.now()
    Moves.getAllBoardMoves(this.board).forEach(piece => {
      piece.moves.forEach(move => {
        move.from = piece.from
        let val = -negaMax(createChildBoard(this.board, move), 1, -99999, 99999, this.isWhite ? -1 : 1)
        if (val > bestValue) {
          bestValue = val
          bestMove = move
        }
      })
    })
    this.board = createChildBoard(this.board, bestMove)
    this.chessboard = createChessboard(this.board)
    this.isWhiteTurn = this.board.isWhite
    showMessage('success', `${bestMove.from} => ${bestMove.to} (${this.board.pieces[bestMove.to]})`)
    console.log(ev);
    ev = 0
    this.changed = true
    console.log(Date.now() - n ,eTime, cTime);
  }
}

let eTime = 0
function negaMax(board, depth, alpha, beta, color) {
  if (depth > 4) { //is terminal node
    eTime -= Date.now()
    let v = color * evaluation(board)
    eTime += Date.now()
    return v
  }

  const currentVal = color * evaluation(board)
  if (Math.abs(currentVal) > 600) {
    return currentVal
  }

  // let currentVal = color * evaluation(board)
  // if (currentVal > beta) {
  //   return currentVal
  // }

  let bestValue = -99999

  let pieces = Moves.getAllBoardMoves(board)

  for (let pieceI = 0; pieceI < pieces.length; pieceI++) {
    let piece = pieces[pieceI]

    for (let moveI = 0; moveI < piece.moves.length; moveI++) {
      let move = piece.moves[moveI]
      move.from = piece.from

      let val = -negaMax(createChildBoard(board, move), depth + 1, -beta, -alpha, -color)

      bestValue = val > bestValue ? val : bestValue
      alpha = alpha > bestValue ? alpha : bestValue
      if (alpha > beta) {
        break
      }
    }

    if (alpha > beta) {
      break
    }
  }

  return bestValue
}
let ev = 0

function evaluation(board) {
  ev ++
  let val = 0

  // board.pieces.forEach((piece, i) => { //i = 21, piece = 4
  //   if (piece != 0 && piece != 99) {
  //     // val += piece
  //     // val += Math.abs(piece) == 1 ? values[Math.abs(piece)][i] : -values[Math.abs(piece)][i] //no simmetry
  //     val += values[Math.sign(piece)][Math.abs(piece)][i]
  //   }
  // })

  for (let x = 1; x < 9; x++) {
    for (let y = 20; y < 100; y += 10) {
      let i = y + x
      let piece = board.pieces[i]
      if (piece != 0 && piece != 99) {
        val += values[Math.sign(piece)][Math.abs(piece)][i]
      }
    }
  }

  return val
}

const values = {"-1": [[],
  //pawn
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,   -0,   -0,   -0,   -0,   -0,   -0,   -0,   -0, null,
    null,  -15,  -15,  -15,  -15,  -15,  -15,  -15,  -15, null,
    null,  -11,  -11,  -12,  -13,  -13,  -12,  -11,  -11, null,
    null,-10.5,-10.5,  -11,-12.5,-12.5,  -11,-10.5,-10.5, null,
    null,  -10,  -10,  -10,  -12,  -12,  -10,  -10,  -10, null,
    null,-10.5,  9.5,   -9,  -10,  -10,   -9,  9.5,-10.5, null,
    null,-10.5,  -11,  -11,   -9,   -9,  -11,  -11,-10.5, null,
    null,   -0,   -0,   -0,   -0,   -0,   -0,   -0,   -0, null],
  //knight
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,  -25,  -26,  -27,  -27,  -27,  -27,  -26,  -25, null,
    null,  -26,  -28,  -30,  -30,  -30,  -30,  -28,  -26, null,
    null,  -27,  -30,  -31,-31.5,-31.5,  -31,  -30,  -27, null,
    null,  -27,-30.5,-31.5,  -32,  -32,-31.5,-30.5,  -27, null,
    null,  -27,  -30,-31.5,  -32,  -32,-31.5,  -30,  -27, null,
    null,  -27,-30.5,  -31,-31.5,-31.5,  -31,-30.5,  -27, null,
    null,  -26,  -28,  -30,  3.5,  3.5,  -30,  -28,  -26, null,
    null,  -25,  -24,  -27,  -27,  -27,  -27,  -24,  -25, null],
  //bishop
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,  -29,  -30,  -30,  -30,  -30,  -30,  -30,  -29, null,
    null,  -30,  -31,  -31,  -31,  -31,  -31,  -31,  -30, null,
    null,  -30,  -31,-31.5,  -32,  -32,-31.5,  -31,  -30, null,
    null,  -30,-31.5,-31.5,  -32,  -32,-31.5,-31.5,  -30, null,
    null,  -30,  -31,  -32,  -32,  -32,  -32,  -31,  -30, null,
    null,  -30,  -32,  -32,  -32,  -32,  -32,  -32,  -30, null,
    null,  -30, 30.5,  -31,  -31,  -31,  -31, 30.5,  -30, null,
    null,  -29,  -30,  -28,  -30,  -30,  -28,  -30,  -29, null],
  //rook
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,  -50,  -50,  -50,  -50,  -50,  -50,  -50,  -50, null,
    null,-50.5,  -51,  -51,  -51,  -51,  -51,  -51,-50.5, null,
    null,-49.5,  -50,  -50,  -50,  -50,  -50,  -50,-49.5, null,
    null,-49.5,  -50,  -50,  -50,  -50,  -50,  -50,-49.5, null,
    null,-49.5,  -50,  -50,  -50,  -50,  -50,  -50,-49.5, null,
    null,-49.5,  -50,  -50,  -50,  -50,  -50,  -50,-49.5, null,
    null,-49.5,  -50,  -50,  -50,  -50,  -50,  -50,-49.5, null,
    null,  -50,  -50,-50.5,-50.5,-50.5,  -50,-50.5,  -50, null],
  //queen
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,  -88,  -89,  -89,-89.5,-89.5,  -89,  -89,  -88, null,
    null,  -89,  -90,  -90,  -90,  -90,  -90,  -90,  -89, null,
    null,  -89,  -90,-90.5,-90.5,-90.5,-90.5,  -90,  -89, null,
    null,-89.5,  -90,-90.5,-90.5,-90.5,-90.5,  -90,-89.5, null,
    null,-90.5,  -90,-90.5,-90.5,-90.5,-90.5,  -90,-90.5, null,
    null,  -89,-90.5,-90.5,-90.5,-90.5,-90.5,-90.5,  -89, null,
    null,  -89,  -90,-90.5,  -90,  -90,  -90,  -90,  -89, null,
    null,  -88,  -89,  -89,  -88,-89.5,  -89,  -89,  -88, null],
  //kink
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null, -997, -996, -996, -995, -995, -996, -996, -997, null,
    null, -997, -996, -996, -995, -995, -996, -996, -997, null,
    null, -997, -996, -996, -995, -995, -996, -996, -997, null,
    null, -997, -996, -996, -995, -995, -996, -996, -997, null,
    null, -998, -997, -997, -996, -996, -997, -997, -998, null,
    null, -999, -998, -998, -998, -998, -998, -998, -999, null,
    null,-1002,-1002,-1000,-1000,-1000,-1000,-1002,-1002, null,
    null,-1002,-1004,-1003, -999,-1000,-1004,-1003,-1002, null]
], "1": [[],
  //pawn
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,    0,    0,    0,    0,    0,    0,    0,    0, null,
    null, 10.5,   11,   11,    9,    9,   11,   11, 10.5, null,
    null, 10.5,  9.5,    9,   10,   10,    9,  9.5, 10.5, null,
    null,   10,   10,   10,   12,   12,   10,   10,   10, null,
    null, 10.5, 10.5,   11, 12.5, 12.5,   11, 10.5, 10.5, null,
    null,   11,   11,   12,   13,   13,   12,   11,   11, null,
    null,   15,   15,   15,   15,   15,   15,   15,   15, null,
    null,    0,    0,    0,    0,    0,    0,    0,    0, null],
  //knight
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,   25,   24,   27,   27,   27,   27,   24,   25, null,
    null,   26,   28,   30, 30.5, 30.5,   30,   28,   26, null,
    null,   27, 30.5,   31, 31.5, 31.5,   31, 30.5,   27, null,
    null,   27,   30, 31.5,   32,   32, 31.5,   30,   27, null,
    null,   27, 30.5, 31.5,   32,   32, 31.5, 30.5,   27, null,
    null,   27,   30,   31, 31.5, 31.5,   31,   30,   27, null,
    null,   26,   28,   30,   30,   30,   30,   28,   26, null,
    null,   25,   26,   27,   27,   27,   27,   26,   25, null],
  //bishop
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,   29,   30,   28,   30,   30,   28,   30,   29, null,
    null,   30, 31.5,   31,   31,   31,   31, 31.5,   30, null,
    null,   30,   32,   32,   32,   32,   32,   32,   30, null,
    null,   30,   31,   32,   32,   32,   32,   31,   30, null,
    null,   30, 31.5, 31.5,   32,   32, 31.5, 31.5,   30, null,
    null,   30,   31, 31.5,   32,   32, 31.5,   31,   30, null,
    null,   30,   31,   31,   31,   31,   31,   31,   30, null,
    null,   29,   30,   30,   30,   30,   30,   30,   29, null],
  //rook
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,   50,   50,   50, 50.5, 50.5,   50,   50,   50, null,
    null, 49.5,   50,   50,   50,   50,   50,   50, 49.5, null,
    null, 49.5,   50,   50,   50,   50,   50,   50, 49.5, null,
    null, 49.5,   50,   50,   50,   50,   50,   50, 49.5, null,
    null, 49.5,   50,   50,   50,   50,   50,   50, 49.5, null,
    null, 49.5,   50,   50,   50,   50,   50,   50, 49.5, null,
    null, 50.5,   51,   51,   51,   51,   51,   51, 50.5, null,
    null,   50,   50, 50.5,   50,   50,   50, 50.5,   50, null],
  //queen
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null,   88,   89,   89,   88,  89.5,   89,   89,   88, null,
    null,   89,   90, 90.5,   90,   90,   90,   90,   89, null,
    null,   89, 90.5, 90.5, 90.5, 90.5, 90.5, 90.5,   89, null,
    null, 90.5,   90, 90.5, 90.5, 90.5, 90.5,   90, 90.5, null,
    null, 89.5,   90, 90.5, 90.5, 90.5, 90.5,   90, 89.5, null,
    null,   89,   90, 90.5, 90.5, 90.5, 90.5,   90,   89, null,
    null,   89,   90,   90,   90,   90,   90,   90,   89, null,
    null,   88,   89,   89, 89.5, 89.5,   89,   89,   88, null],
  //kink
  [ null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null,
    null, 1002, 1004, 1003,  999, 1000, 1003, 1004, 1002, null,
    null, 1002, 1002, 1000, 1000, 1000, 1000, 1002, 1002, null,
    null,  999,  998,  998,  998,  998,  998,  998,  999, null,
    null,  998,  997,  997,  996,  996,  997,  997,  998, null,
    null,  997,  996,  996,  995,  995,  996,  996,  997, null,
    null,  997,  996,  996,  995,  995,  996,  996,  997, null,
    null,  997,  996,  996,  995,  995,  996,  996,  997, null,
    null,  997,  996,  996,  995,  995,  996,  996,  997, null],
]}
