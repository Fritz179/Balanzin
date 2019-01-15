class PlayerChessboard extends Chessboard {
  constructor() {
    super()
  }

  onMove(move) {
    socket.emit('move', move)
  }
}
