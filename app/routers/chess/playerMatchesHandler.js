const matches = {}
const whites = []

module.exports.addMatch = (white, black) => {
  whites.push(white)
  matches[white] = black
  matches[black] = white
}

module.exports.getGameById = sessionId => {
  if (!matches[sessionId]) {
    console.log('failed lookup for a game: ' + sessionId);
    return {isWhite: false, id: false}
  }

  const white = whites.includes(sessionId) ? sessionId : matches[sessionId]
  const black = matches[white]

  const output = {
    isWhite: sessionId == white,
    gameId: white + black
  }

  whites.filter(id => id != white)

  return output
}

module.exports.endGame = gameId => {
  console.log('almost deliting game: ' + gameId);
}
