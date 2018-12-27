const order = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

class Chessboard {
  constructor(pieces) {
    this.pieces = pieces
    this.states = []
    for (let x = 0; x < 8; x++) {
      this.states[x] = []
      for (let y = 0; y < 8; y++) {
        if (y == 1 || y == 6) {
          this.states[x][y] = {piece: 'pawn', isWhite: y == 6}
        } else if (y == 0 || y == 7) {
          this.states[x][y] = {piece: order[x], isWhite: y == 7}
        } else {
          this.states[x][y] = {piece: null}
        }
      }
    }
    this.w = 80
  }

  draw() {
    fill(255)
    stroke(0)
    strokeWeight(10)
    rect(0, 0, this.w * 8, this.w * 8)
    this.states.forEach((row, x) => {
      row.forEach((state, y) => {
        (x + y) % 2 != 0 ? fill(102, 51, 0) : fill(204, 153, 0)
        noStroke()
        rect(x * this.w, y * this.w, this.w, this.w)
        if (state.piece) {
          image(this.pieces[state.piece][state.isWhite ? 'white' : 'black'], x * this.w, y * this.w, this.w, this.w)
        }
      })
    })
  }
}
