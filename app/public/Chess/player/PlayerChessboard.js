class PlayerChessboard extends Chessboard {
  constructor() {
    super()
  }

  setColor(isWhite) {
    this.IAmWhite = isWhite
  }

  onMove(move) {
    socket.emit('move', move)
  }
}
