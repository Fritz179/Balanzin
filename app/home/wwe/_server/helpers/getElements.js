const cards = require('./playerInfo.json');

module.exports = ({difficulty, answered}) => {
  let allowed = cards.filter(el => !answered.includes(el))
  const right = getOne(allowed)

  // reset if all answered
  if (allowed.length <= 0) {
    answered.splice(0)
  }

  // reset all possibility
  allowed = cards.filter(el => el != right)

  // get all other possibility
  const options = []
  for (let i = 0; i < difficulty; i++) {
    options.push(getOne(allowed))
  }

  // add the right one
  options.splice(Math.floor(Math.random() * options.length), 0, right)
  answered.push(right)

  return {options, right}
}

function getOne(arr) {
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
}
