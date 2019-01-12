class PlayerChessboard extends Chessboard {
  constructor() {
    super()
  }

  setColor(isWhite) {
    this.whiteBoard = isWhite
    this.changed = true
  }

  onMove(move) {
    socket.emit('move', move)
  }
}
