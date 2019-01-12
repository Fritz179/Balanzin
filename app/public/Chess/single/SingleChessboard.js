class SingleChessboard extends Chessboard {
  constructor() {
    super()
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
