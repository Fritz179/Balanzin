const whites = {}
const blacks = {}

module.exports.addMatch = (white, black) => {
  whites[white] = black
  blacks[black] = white
}

module.exports.getGameById = sessionId => {
  let match, white, black, isWhite

  if (black = whites[sessionId]) {
    white = sessionId
  } else if (white = blacks[sessionId]){
    black = sessionId
  } else {
    console.log('failed lookup for a game: ' + sessionId);
    return {}
  }

  return {
    gameId: white + black,
    isWhite: white == sessionId
  }
}

module.exports.endGame = gameId => {
  const black = gameId.slice(gameId.length / 2)

  delete whites[blacks[black]]
  delete blacks[black]
}
