const matches = []

module.exports.addMatch = (white, black) => {
  matches.push(new Match(white, black))
}

class Match {
  constructor(white, black) {
    this.white = white
    this.black = black
  }
}
