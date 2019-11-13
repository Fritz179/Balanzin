function compress(tokens, open, close) {

  let compressed = [], start = -1, end = -1
  while ((start = tokens.indexOf(open)) != -1) {
    compressed = compressed.concat(tokens.splice(0, start))
    tokens.splice(0, 1)
    const secondPart = compress(tokens, open, close)

    if ((end = secondPart.indexOf(close)) == -1) {
      throw new Error('No matching: ' + close)
    }

    compressed.push(secondPart.splice(0, end))
    secondPart.splice(0, 1)
    compressed = compressed.concat(secondPart)
    compressed.delimeters = open + close
    return compressed
  }

  return tokens
}

function tokenize(string) {
  let serial = string.replace(/\/\/.*?$/gm, '') // delte comments

  serial = serial.replace(/\s+/g, ' ')                                // remove white spaces, tabs, newlines
  serial = serial.replace(/(\S)([\)\}\(\{\+\-\*\/\%\,\!])/g, "$1 $2") // transform a) to a )
  serial = serial.replace(/([\(\{\)\}\+\-\*\/\%\,])(\S)/g, "$1 $2")   // transform (a to ( a
  serial = serial.replace(/([\+\-\*\/\%\,])\s([\+\-\=])/g, "$1$2")    // transform + = to +=
  serial = serial.replace(/([\!])(\w)/g, "$1 $2")                     // transform !a to ! a
  serial = serial.trim()

  if (!serial.length) {
    throw new Error('No input!')
  }
  console.log('serial: ', serial);

  tokens = serial.split(' ')
  tokens = compress(tokens, '(', ')')
  tokens = compress(tokens, '{', '}')
  return tokens
}
