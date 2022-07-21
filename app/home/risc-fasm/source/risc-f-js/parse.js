const keywords = ['a', 'b', 'c', 'si', 'di', 'pc', 'sp']

export default function parse(source) {
  const parsed = []

  source.split('\n').forEach((text, i) => {
    let trimmed = text.trim()

    // remove comment
    const commentMatch = trimmed.match(/(?<=;).*/)
    if (commentMatch) trimmed = trimmed.slice(0, commentMatch.index - 1).trim()
    const comment = commentMatch ? commentMatch[0] : null

    // remove place
    const placeMatch = trimmed.match(/.*(?=:)/)
    if (placeMatch) trimmed = trimmed.slice(placeMatch[0].length + 1).trim()
    const place = placeMatch ? placeMatch[0] : null

    // separate inst
    const instMatch = trimmed.match(/[a-zA-Z0-9_-]+/)
    if (instMatch) trimmed = trimmed.slice(instMatch[0].length).trim()
    const inst = instMatch ? instMatch[0] : null

    // separate args
    const rest = trimmed.length ? trimmed.split(',').map(arg => arg.trim()) : []
    const args = rest.map(arg => {

      // number
      const number = Number(arg)
      if (!Number.isNaN(number)) {
        return {
          type: 'number',
          value: number,
          exec: number,
          orignal: arg,
        }
      }

      // char
      if (arg.match(/'.'/)) {
        return {
          type: 'char',
          char: arg[1],
          value: arg.charCodeAt(1),
          exec: arg.charCodeAt(1),
          orignal: arg,
        }
      }

      // string
      if (arg.match(/".*"/)) {
        return {
          type: 'string',
          string: arg.slice(1, -1),
          length: arg.length - 2,
          orignal: arg,
          exec: null
        }
      }

      // keyword
      if (keywords.includes(arg)) {
        return {
          type: 'keyword',
          value: arg,
          orignal: arg,
          exec: arg
        }
      }

      // probably const
      return {
        type: 'const',
        value: arg,
        orignal: arg,
        exec: null
      }
    })

    parsed.push({
      inst,
      args,
      place,
      comment,
      line: text,
      lineNumber: i,
      bytePos: null,
      opcode: null,
      multiLine: false,
      prevLines: null,
      printLine: null,
    })
  })

  return parsed
}