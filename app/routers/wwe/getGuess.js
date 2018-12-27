const cards = require('./playerInfo.json');

module.exports = (socket, mode = 'logo') => {
  const max = 3
  let num = []
  for (let i = 0; i < max; i++) {
    num.push(r(cards.length, [...num, socket.right]))
  }

  socket.right = num[r(max)]
  socket.rightName = cards[socket.right].name
  let guess = {
    url: `/public/wwe/${mode}/${cards[socket.right].id}.png`,
    options: num.map(n => cards[n].name)
  }
  return guess
}

function r(max, excluded = []) {
  let output
  do {
    output = Math.floor(Math.random() * max)
  } while (excluded.includes(output))
  return output
}
