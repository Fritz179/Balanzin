class SingleChessboard extends Chessboard {
  constructor() {
    super()
  }

  mouseReleased_child(x, y, piece) {
    
  }

  isMyTurn() {
    return true
  }

  canMoveWhite() {
    return this.isWhiteTurn
  }

  canMoveBlack() {
    return !this.isWhiteTurn
  }
}
