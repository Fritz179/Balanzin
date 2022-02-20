 interface baseArg {
  original: string
  type: 'number' | 'string' | 'register' | 'const'
  value: number | string | string[]
  exec: number | string
}

interface numArg extends baseArg {
  type: 'number'
  value: number
}

interface strArg extends baseArg {
  type: 'string' | 'register'
  value: string
}

interface constArg extends baseArg {
  type: 'const'
  value: string[]
}

export type arg = numArg | strArg | constArg

interface baseLine {
  type: 'text' | 'code'
  lineText: string,
  lineNumber: number,
  place: string,
  comment: string,
}

interface textLine extends baseLine {
  type: 'text'
}

interface assemblableLine extends baseLine {
  type: 'code'
  inst: string,
  args: arg[],
}

interface assembledLine extends assemblableLine {
  bytePos: number,
  opcode: number,
  multiLine: boolean,
}

export interface printableLine {
  prevLines: string,
  printLine: string
}

export type parsed = assemblableLine | textLine
export type assembled = assembledLine | textLine
export type compiled = assembled & printableLine
export type code = assembledLine & printableLine

export const REG_TO_NUM: {[key: string]: number} = {}
export const NUM_TO_REG = ['pc', 'sp', 'si', 'di', 'a', 'b', 'c', 'ram']
NUM_TO_REG.forEach((el, i) => REG_TO_NUM[el] = i)

export default function parse(source: string): parsed[] {
  const parsed: parsed[] = []

  source.split('\n').forEach((text, i) => {
    let trimmed = text.trim()

    // remove comment
    const commentMatch = trimmed.match(/(?<=;).*/)
    if (commentMatch) trimmed = trimmed.slice(0, commentMatch.index! - 1).trim()
    const comment = commentMatch?.[0] || ''

    // remove place
    const placeMatch = trimmed.match(/.*(?=:)/)
    if (placeMatch) trimmed = trimmed.slice(placeMatch[0].length + 1).trim()
    const place = placeMatch?.[0] || ''

    // separate inst
    const instMatch = trimmed.match(/[a-zA-Z0-9_-]+/)
    if (instMatch) trimmed = trimmed.slice(instMatch[0].length).trim()
    const inst = instMatch?.[0]

    // separate args
    const rest = trimmed.length ? trimmed.split(',').map(arg => arg.trim()) : []
    const args = rest.map((arg: string): arg => {

      // number
      const number = Number(arg)
      if (!Number.isNaN(number)) {
        return {
          type: 'number',
          value: number,
          exec: number,
          original: arg,
        }
      }

      // char
      if (arg.match(/'.'/)) {
        return {
          type: 'number',
          value: arg.charCodeAt(1),
          exec: arg.charCodeAt(1),
          original: arg.charAt(1),
        }
      }

      // string
      if (arg.match(/".*"/)) {
        return {
          type: 'string',
          value: arg.slice(1, -1),
          original: arg,
          exec: -1
        }
      }

      // keyword
      if (NUM_TO_REG.includes(arg)) {
        return {
          type: 'register',
          value: arg,
          original: arg,
          exec: arg
        }
      }

      // probably const
      const constExpr = arg.split(/\s/)

      return {
        type: 'const',
        value: constExpr,
        original: arg,
        exec: -1
      }
    })

    if (inst) {
      parsed.push({
        type: 'code',
        place,
        inst,
        args,
        comment,
        lineText: text,
        lineNumber: i,
      })
    } else {
      parsed.push({
        type: 'text',
        place,
        comment,
        lineText: text,
        lineNumber: i,
      })
    }
  })

  return parsed
}