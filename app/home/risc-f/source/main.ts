const registersIndex = ['r0', 'ra', 'rb', 'rc', 'rd', 're', 'rf', 'sp']

type BaseToken = {
  type: string,
  span: Span,
  token: string,
}

type OperatorTypes = 'unary' | 'binary' | 'conditional'
type NumberToken = { type: 'number', value: number }
type StringToken = {
  type: 'string'
}

type Token = BaseToken & (
  NumberToken |
  StringToken | {
    type: 'fileStart' | 'fileEnd' | 'registerLiteral' | 'eval' | 'comment' | 'symbol' | 'stringLiteral' | 'unknown' | `${OperatorTypes}Operator`
  }
)

type Span = {
  fileName: string,
  line: number,
  colum: number,
  print: string
}

const basicSpan: Span = {
  fileName: '_basic',
  line: 0,
  colum: 0,
  print: '_basic:0:0'
}

const operators = {
  unary: ['++', '--', '~'],
  binary: ['+', '-', '&', '|', '^', '*', '/'],
  conditional: ['<', '<=', '==', '>=', '>', '!=']
} as const

type UnaryOperator = typeof operators.unary[number]
type BinaryOperator = typeof operators.binary[number]
type ConditionalOperator = typeof operators.conditional[number]
type Operator = UnaryOperator | BinaryOperator | ConditionalOperator

type BaseBinaryType = Exclude<BinaryOperator, '*' | '/'>

const conditionalJump = ['bnc' , 'bc' , 'bnz' , 'bz' , 'bnn' , 'bn'] as const
type CodntionalJump = typeof conditionalJump[number]

// TYPES

type BaseType = {
  size: number,
  span: Span,
  print: string,
  name: string,  // Neded for typeDef to easily change the name
  isStack?: Boolean
}

type Type = BaseType & ({
  type: 'basic' | 'void' | 'literalNumber'
} | {
  type: 'pointer',
  to: Type,
})

function createType(name: string): Type {
  return {
    type: 'basic',
    name,
    size: 1,
    span: basicSpan,
    print: name,
  }
}

function createPointer(to: Type): Type {
  return {
    type: 'pointer',
    to: to,
    size: 1,
    name: to.name,
    span: basicSpan,
    print: `${to.print}*`
  }
}

// exposed dataType
const wordType = createType('word')

// base dataType
const pointerDiffType = createType('ptrdiff_t')
const charType = createType('char_t')
const boolType = createType('bool_t')
const pixelType = createType('pixel_t') // PRAM
const tileType = createType('tile_t') // TRAM
const instType = createType('inst_t') // inst
const stackType = createType('stack_t') // stack top

// pointer to base dataType
const charPtrType = createPointer(charType)
const pixelPtrType = createPointer(pixelType)
const tilePtrType = createPointer(tileType)
const addrType = createPointer(instType) // address

const voidType: Type = {
  type: 'void',
  size: 0,
  name: 'void',
  span: basicSpan,
  print: 'void',
}

const literalType: Type = {
  type: 'literalNumber',
  size: 0,
  name: 'literalNumber',
  span: basicSpan,
  print: 'literalNumber',
}

const registers = ['r0', 'ra', 'rb', 'rc', 'rd', 're', 'rf', 'sp', 'pc'] as const
type Register = typeof registers[number]
function isRegister(test: string): test is Register {
  return registers.includes(test as Register)
}

type BaseOperand = {type: string, dataType: Type, span: Span }

type LabelName = string & { __brand: 'labelName' }
type Label = BaseOperand & { type: 'label', value: number, name: LabelName }

type BaseVariable = BaseOperand & { name: string, span: Span }
type StackVariable = BaseVariable & { type: 'stack', offset: number, info: {defined: boolean} }
type GlobalVariable = BaseVariable & { type: 'global', offset: number, info: {defined: boolean}, expr?: Operand }
type RegisterVariable = BaseVariable & { type: 'register', name: string, id: RegisterID }
type FunctionVariable = BaseVariable & { type: 'functionVariable', name: string, function: FunctionDefinition}

type VariableOperand = StackVariable | GlobalVariable | RegisterVariable | FunctionVariable
type NumberOperand = BaseOperand & { type: 'number', value: number}
type DerefOperand = BaseOperand & { type: 'deref', of: RegisterVariable, offset: number }
type ArrayOperand = BaseOperand & { type: 'array', array: Operand[] }
type StringOperand = BaseOperand & { type: 'string', string: string }
type BinaryOperand = BaseOperand & { type: 'binary', lhs: Operand, rhs: Operand, operator: BaseBinaryType }
type UnaryOperand = BaseOperand & { type: 'unary', lhs: Operand, rhs: Operand, operator: UnaryOperator }
type ConditionalOperand = BaseOperand & { type: 'conditional', lhs: Operand, rhs: Operand, operator: ConditionalOperator }
type CallOperand = BaseOperand & { type: 'functionCall', function: FunctionDefinition }

type Operand =  VariableOperand | NumberOperand | DerefOperand | ArrayOperand | StringOperand | BinaryOperand | CallOperand | Label | UnaryOperand | ConditionalOperand


// Function

type FunctionDefinition = {
  type: 'functionDefinition',
  args: VariableOperand[],
  name: string,
  dataType: Type,
  beginLabel: Label,
  endLabel: Label,
  returnAddress: RegisterVariable,
  context: Context,
  span: Span
}

// Lexer, State, Context

type Lexer = {
  next: (...types: Token["type"][]) => Token,
  peek: (index?: number) => Token,
  nextIs: (...values: string[]) => Token,
  unNext: (data: string, fileName: string) => void
}

type Memory = {
  value: number,
  inst?: Opcode,
  decoder?: ExecOpcode
}

type Simulation = {
  alu: (a: Register, b: Register, d: Register, exec: (a: number, b:number) => number) => void
  readMemory: (index: number) => number
  writeMemory: (index: number, value: number) => void
  getRegister: (name: Register) => Memory
  setRegister: (name: Register, value: number) => number
  flags: {
    n: boolean,
    z: boolean,
    c: boolean
  },
  interrupt: () => void
  stepSimulation: (count: number, print?: boolean) => void,
  memory: Memory[]
  registers: {
    [key in Register]: Memory
  }
  vga: {

  }
}

type ExecOpcode = (s: Simulation) => void

type Opcode = {
  opcode: number,
  rType: string,
  rName: string,
  exec: ExecOpcode,
  print: string,
  pc?: number,
  inst?: Instruction,
}

type Instruction = {
  span: Span,
  print: string,
  opcodes: Opcode[]
}

type OpcodeResolver = (info: Info) => Instruction

type State = {
  defines: {[key: string]: NumberOperand | undefined}
  labels: {[key: LabelName]: Label | undefined}
  types: {[key: string]: Type | undefined}
  functions: {[key: string]: FunctionVariable | undefined}
  globalContext: Context
  constProgram: OpcodeResolver[]
  executable: Opcode[]
  program: {
    push: (resolve: OpcodeResolver) => void
    take: () => OpcodeResolver[]
    append: (array: OpcodeResolver[]) => void
    instructions: OpcodeResolver[],
    result: Instruction[]
  }
  printable: {
    addresses: {
      [key: number]: number
    }
    lines: string[]
  }
  simulation: Simulation | null
}

type StackOrGlobalVariable = StackVariable | GlobalVariable

// Type Context

const availableRegs = ['ra', 'rb', 'rc', 'rd', 're', 'rf'] as const
type AvailableRegs = typeof availableRegs[number]

type RegisterID = string & { __brand: 'regisreID' }
type RegisterInfo = { register: AvailableRegs, name: string, type: Type, span: Span }

const r0ID = 'r0' as RegisterID
const spID = 'sp' as RegisterID
const raID = 'ra' as RegisterID

type Info = {
  getReg: (reg: RegisterID) => RegisterInfo,
  solveLabel: (label: LabelName) => number
  pc: number
}

 const PRAM_BEGIN = 0b1000_0000_0000_0000
 const TRAM_BEGIN = 0b1010_0000_0000_0000
 const PROGRAM_ENTRY_POINT = 0b1100_0000_0000_0000
 const MEMORY_MAPPED = 0b1111_1111_1111_0000

 const MM_KEYBOARD = 0b1111_1111_1111_0000
 const MM_INT_VEC = 0b1111_1111_1111_0001
 const MM_INT_EN = 0b1111_1111_1111_0010

// Assertions

let sources: {[key: string]: string | undefined} = {}

function assert(assertion: any, message: string): asserts assertion {
  if (!assertion) {
    console.trace(message)
    throw message
  }
}

function assertUnreachable(x: never): never {
  console.log(x)
  assert(false, `ERROR: UNREACHABLE`)
}

function assertUnimplemented(message: string): never {
  assert(false, `ERROR: UNIMPLEMENTED: ${message}`)
}

function assertSpan(span: Span, condition: any, message: string): asserts condition {
  if (!condition) {
    const fileName = span.fileName
    const line = span.line

    const file = sources[fileName]
    assert(file, 'Invalid file!')

    const cause = file.split('\n')
      .splice(0, line)
      .map((line, i) =>  `${`${i + 1}:`.padEnd(4)} ${line}`)
      .slice(-40)
      .join('\n')

    assert(condition, `${cause}\n\n\nError at line: ${span}\n  ${message}`)
  }
}

function assertToken(tokne: Token, ...values: string[]) {

}

function assertUnexpected(token: Token): never {
  const message = `Unexpected token '${token.token}'`
  assertSpan(token.span, false, message)
}

function getAssertTypesMessage(expr: Operand): string {
  switch (expr.type) {
    case 'number':
      return `immedate value '${expr.value}' which has the type '${expr.dataType.print}'`

    case 'label':
      return `label '${expr.name}' which has the type '${expr.dataType.print}'`

    case 'binary':
      return `binaryExpression resulting in the type '${expr.dataType.print}'`

    case 'unary':
      return `unaryExpression resulting in the type '${expr.dataType.print}'`

    case 'conditional':
      return `conditionalExpression resulting in the type '${expr.dataType.print}'`

    case 'functionCall':
      return `function that returns '${expr.dataType.print}'`

    case 'register':
    case 'stack':
    case 'global':
      return `variable '${expr.name}' which has the type '${expr.dataType.print}'`

    case 'deref':
      return `dereferce which results in ${expr.dataType.print}`

    case 'array':
    case 'string':
      return `${expr.type} ${expr.dataType.print}`

    case 'functionVariable':
      return `funcion operand ${expr.name} which has the type ${expr.dataType.print}`
  }
}

function assertTypes(lhs: Operand, rhs: Operand) {
  const assert = lhs.dataType.print == rhs.dataType.print
  const lMessage = getAssertTypesMessage(lhs)
  const rMessage = getAssertTypesMessage(rhs)
  const message = `The ${lMessage} is not compatible with the ${rMessage}.`

  assertSpan(lhs.span, assert, message)
}

// Char Lexer

function getCharLexer(source: string, fileName: string) {
  sources[fileName] = source

  const chars = source.split('')

  let currLine = 1
  let currColum = 0

  function peek() {
    return chars[0]
  }

  function next(): string {
    const char = chars.shift()
    currColum++

    if (char == '\n') {
      currLine++
      currColum = 0
    }

    assert(char, 'Enexpected end of input')

    return char
  }

  function getCurrentSpan(): Span {
    return {
      fileName,
      line: currLine,
      colum: currColum,
      print: `${fileName}:${currLine}:${currColum}`
    }
  }

  function getFileName() {
    return fileName
  }

  return {next, getCurrentSpan, peek, getFileName}
}

function tokenize(source: string, fileName: string) {
  const lexer = getCharLexer(source, fileName)

  const tokens: Token[] = [{
    type: 'fileStart',
    span: lexer.getCurrentSpan(),
    token: fileName
  }]

  while (lexer.peek()) {
    let token = lexer.next()

    // ignore whitespaces, newlines
    if (token.match(/\s/)) {
      continue
    }

    const span = lexer.getCurrentSpan()

    // start of a number
    if (token.match(/[0-9]/)) {

      // consume until first space
      while (lexer.peek() && lexer.peek().match(/[0-9a-zA-Z_]/)) {
        token += lexer.next()
      }

      // check for valid number
      const number = Number(token.replaceAll('_', ''))
      assertSpan(span, !isNaN(number), 'Malformed number: ' + token)

      tokens.push({
        token,
        span,
        value: number,
        type: 'number',
      })
      continue
    }

    // string
    if (token.match(/[a-zA-Z_]/)) {
      while (lexer.peek() && lexer.peek().match(/[a-zA-Z0-9_]/)) {
        token += lexer.next()
      }

      if (registersIndex.includes(token)) {
        tokens.push({
          token: token,
          span,
          type: 'registerLiteral',
        })
        continue
      }

      if (token == 'eval') {
        const start = lexer.next()
        assertSpan(span, start == '(', 'Malformed eval')

        let depth = 1
        let body = ''

        while (lexer.peek()) {
          const next = lexer.next()
          if (next == '(') depth++
          if (next == ')') depth--

          if (depth == 0) break
          body += next
        }

        assertSpan(span, depth == 0, 'Cannot find matching closing )')

        tokens.push({
          token: body,
          span,
          type: 'eval',
        })
        continue
      }

      tokens.push({
        token,
        span,
        type: 'string',
      })
      continue
    }


    // start of comment
    if (token == '/') {

      // single line
      if (lexer.peek() == '/') {
        while (lexer.peek() && lexer.peek() != '\n') {
          token += lexer.next()
        }

        tokens.push({
          token: token,
          span: span,
          type: 'comment',
        })
        continue

      }

      if (lexer.peek() == '*') {
        lexer.next()
        token = '//'

        while (true) {
          const next = lexer.next()

          if (next == '*' && lexer.peek() == '/') break

          if (next == '\n') {
            tokens.push({
             token,
             span: span,
             type: 'comment'
            })

            token = '//'
            continue
          }

          token += next
        }

        lexer.next()

        tokens.push({
          token: token,
          span: lexer.getCurrentSpan(),
          type: 'comment'
        })

        continue
      }
    }

    const symbols = ['(', ')', '{', '}', '[', ']', ':', ';', ',', '?']
    if (symbols.includes(token)) {
      tokens.push({
        token,
        span,
        type: 'symbol'
      })
      continue
    }


    // check for the the two character wide operators first
    function checkOperator(operator: string): boolean {
      function check(type: keyof typeof operators): boolean {

        // @ts-ignore
        if (operators[type].includes(operator)) {
          tokens.push({
            token: operator,
            span,
            type: `${type}Operator`
          })
          return true
        }
        return false
      }

      if (check('unary')) return true
      if (check('binary')) return true
      if (check('conditional')) return true
      return false
    }

    if (lexer.peek() && checkOperator(token + lexer.peek())) {
      lexer.next()
      continue
    }

    if (checkOperator(token)) continue

    if (token == '"' || token == "'") {
      token = ''

      while (lexer.peek() && lexer.peek() != token) {
        token += lexer.next()
      }

      lexer.next()

      tokens.push({
        token,
        span,
        type: 'stringLiteral',
      })

      continue
    }

    tokens.push({
      token,
      span,
      type: 'unknown'
    })
    // assertUnreachable(`Unknown token: ${char}, at: }`)

    tokens.push({
      token: fileName,
      span,
      type: 'fileEnd'
    })

  }

  return tokens
}

/*
type mapper<TT extends { type: string }> = {
    [T in TT as T["type"]]: TT[T];
}


interface t {
    [key: Token["type"]]: (type: T["type"]) => T;
}


type t = (type: Types) => Extract<Token["type"], "number">
type f = Extract<Token["type"], "number">

type Helper<U, T, R> = T extends U ? R : never
type Test<T extends { type: string }, U> = Helper<T["type"], U, T>

type Mapper<T extends {type: string}> = {
  [key in T as T["type"]]: T
}

type M = Mapper<Token>

type E<T extends { type: string }, U> = T["type"] extends U ? T : never

type l = E<Token, 'fileStart'>

type g = Test<Token, "fileStart">

const s = {key: 'ah', aaa: 'asdf'} as const
type w = (typeof s)[keyof typeof s]
type p = keyof typeof s
*/

type Types = Token["type"]

// return the lexer for each token
function getTokenLexer(tokens: Token[]): Lexer {
  function next(...types: Types[]): Token {
    const token = tokens.shift()
    assert(token, 'Unexpected end of input')

    if (types.length) {
      assertSpan(token.span, types.includes(token.type), `Expecten token of type: '${types.join(' | ')}' but got: '${token.token}' which is of type: '${token.type}' instead.`)
    }

    return token
  }

  function nextIs(...values: string[]) {
    const token = tokens.shift()
    assert(token, 'Unexpected end of input')

    if (values.length) {
      assertSpan(token.span, values.includes(token.token), `Expected: '${values.join(' | ')}' but got: '${token.token}' instead.`)
    }

    return token
  }

  function peek(index = 0) {
    // peek returns an empty token
    return tokens[index] || {}
  }

  function unNext(data: string, fileName: string) {
    const newTokens = tokenize(data, fileName)
    tokens = newTokens.concat(...newTokens)
  }

  return {next, peek, nextIs, unNext}
}

/*
  An number al po esa literal o castu

  Type => type => literal
  Operand => type number / string / array

*/

// get unique identifiers
const nextInt: () => number = (() => {
  let lastValue = 1
  return () => lastValue++
})()



// operands
function buildOperand(lexer: Lexer, state: State, context: Context): Operand {
  const start = lexer.next()

  if (start.type == 'symbol') {
    assertToken(start, '[', '(')

    if (start.token == '[') {
      const array: NumberOperand[] = []

      while (true) {
        const el = buildOperand(lexer, state, context)

        assertSpan(start.span, el.dataType.type == 'literalNumber', 'Not an array of literal values')
        assertSpan(start.span, el.type == 'number', 'Not an array of literal numbers')
        array.push(el)

        if (lexer.peek().token != ',') break
        lexer.nextIs(',')
      }

      lexer.nextIs(']')

      return {
        type: 'array',
        dataType: literalType,
        array: array,
        span: start.span
      }
    }

    // type casting
    const type = buildType(lexer, state, context)
    lexer.nextIs(')')

    const operand = buildOperand(lexer, state, context)
    operand.dataType = type

    return {...operand, span: start.span}
  }

  if (start.type == 'binaryOperator') {
    assertToken(start, '*')

    const operand = buildOperand(lexer, state, context)
    const error = `Cannot derefence ${operand.dataType.print} because it is not a pointer to register`

    assertSpan(operand.span, operand.type == 'register', error)
    assertSpan(operand.span, operand.dataType.type == 'pointer', error)

    return {
      type: 'deref',
      dataType: operand.dataType.to,
      of: operand,
      offset: 0,
      span: start.span
    }
  }


  if (start.type == 'number') {
    return {
      type: 'number',
      dataType: literalType,
      value: start.value,
      span: start.span
    }
  }

  if (start.type == 'stringLiteral') {
    return {
      type: 'string',
      string: start.token,
      dataType: literalType,
      span: start.span
    }
  }

  if (start.type == 'string') {
    const operand = context.resolve(start.span, start.token)

    if (operand.type == 'functionVariable') {

      // just the funciton, without calling it
      if (lexer.peek().token != '(') {
        return operand
      }

      lexer.nextIs('(')

      let currArg = 0

      const fun = operand.function
      while (lexer.peek().token != ')') {
        const arg = buildOperand(lexer, state, context)

        assertSpan(operand.span, fun.args.length >= currArg, 'To many args provided')
        assertTypes(arg, fun.args[currArg])

        currArg++
        if (lexer.peek().token != ',') break
        lexer.nextIs(',')
      }

      assertSpan(operand.span, fun.args.length == currArg, 'Not enough args provided')

      lexer.nextIs(')')

      return {
        type: 'functionCall',
        function: fun,
        dataType: operand.dataType,
        span: start.span,
      }
    }

    // just a variable name
    return {
      ...operand,
      span: start.span
    }
  }

  assertUnexpected(start)
}

////////////////////////////////////////////////////////////////////////////////
/*                         --- Build     ---                                  */
////////////////////////////////////////////////////////////////////////////////

// namings:
// parseAssignment => parse if is assignment (lexer, state, context) // solve / unsolve
// buildAssignment => fail if not assignment (lexer, state, context) // solve / unsolve
// solveAssignment => solve assignment (state, context)
// solveLOD => sole LOD operation (state, context)


// labels:
function solveLabel(state: State, context: Context, span: Span, name: LabelName, type?: Type) {
  context.unresolve(span, name)

  if (!type) type = addrType

  state.labels[name] = {
    type: 'label',
    name,
    value: -1,
    dataType: type || addrType,
    span
  }

  state.program.push(info => {
    state.labels[name]!.value = info.pc

    return {
      span,
      print: `${name}:`,
      opcodes: []
    }
  })
}

// parse types
function completeType(lexer: Lexer, state: State, context: Context, base: Type): Type {
  if (lexer.peek().token == '*') {
    const start = lexer.nextIs('*')

    const to = completeType(lexer, state, context, base)

    return {
      type: 'pointer',
      to,
      size: 1,
      span: start.span,
      name: to.name,
      print: `${base.print}*`
    }
  }

  if (lexer.peek().token == '.') {
    assertUnimplemented('field accessing')
  }

  return base
}

function parseType(lexer: Lexer, state: State, context: Context): Type | undefined {
  const isStack = lexer.peek().token == ':'
  if (isStack) lexer.nextIs(':')

  const start = lexer.peek()
  const type = state.types[start.token]

  if (isStack && !type) assertUnexpected(lexer.next())
  if (!type) return

  lexer.next()

  const dataType = completeType(lexer, state, context, type)
  return {
    ...dataType,
    span: start.span,
  	isStack
  }
}

function buildType(lexer: Lexer, state: State, context: Context) {
  const next = lexer.peek()
  const type = parseType(lexer, state, context)
  assertSpan(next.span, type, `Expected type but got '${next.token}' instead`)
  return type
}

function isBinary(lexer: Lexer, state: State, context: Context): boolean {
  const isBinary = lexer.peek().type == 'binaryOperator'

  if (isBinary && lexer.peek().token == '*') {
    const next = lexer.peek(1)

    if (next.type == 'number') return true
    if (next.type != 'string') return false

    const define = state.defines[next.token]
    if (!define) return false

    return define.dataType.type == 'literalNumber'
  }

  return isBinary
}

// expressions
function buildExpression(lexer: Lexer, state: State, context: Context): Operand {
  const operand = buildOperand(lexer, state, context)

  if (isBinary(lexer, state, context)) {
    let lhs = operand

    while (isBinary(lexer, state, context)) {
      const operator = lexer.next('binaryOperator')

      const rhs = buildOperand(lexer, state, context)

      if (lhs.type == 'number' && rhs.type == 'number') {
        const literal = lhs.dataType.type == 'literalNumber' && rhs.dataType.type == 'literalNumber'
        const pointer = lhs.dataType.type == 'pointer' && rhs.dataType.type == 'literalNumber'

        assertSpan(lhs.span, literal || pointer, 'Not both operands are numberLiteral or pointer')

        const a = lhs.value
        const b = rhs.value
        let d: number | null = null

        if (operator.token == '+') d = a + b
        if (operator.token == '-') d = a - b
        if (operator.token == '*') d = a * b
        if (operator.token == '/') d = Math.floor(a / b)

        if (operator.token == '&') d = a & b
        if (operator.token == '|') d = a | b
        if (operator.token == '^') d = a ^ b

        assertSpan(operator.span, d !== null, `Unknown constant operator: ${operator.token}`)

        // lhs could be define, thus changing its value directly creates side effects
        lhs = {...lhs, value: d}
        continue
      }

      assertSpan(operator.span, operator.token != '*' && operator.token != '/', `Invalid operator ${operator.token}`)

      const node: Operand = {
        type: 'binary',
        lhs,
        rhs,
        operator: operator.token as BaseBinaryType,
        dataType: lhs.dataType,
        span: operand.span
      }

      if (lhs.dataType.type == 'pointer' && rhs.dataType.type == 'literalNumber') {
        const assertion = operator.token == '+' || operator.token == '-'
        assertSpan(lhs.span, assertion, 'Can modify pointers only +/- with numberLiteral')
        return node
      }

      // TODO: Cosa aroal da fa?
      if (lhs.dataType.type == 'pointer' && rhs.dataType.type == 'basic') {
        console.warn('Pointer arithmetic with pointer and basic')
        const assert = operator.token == '+' || operator.token == '-'
        assertSpan(lhs.span, assert, 'Can modify pointers only +/- with basic')
        return node
      }

      if (lhs.dataType.type == 'pointer' && rhs.dataType.type == 'pointer') {
        assertSpan(lhs.span, operator.token == '-', 'Two pointers can only subtract')
        node.dataType = pointerDiffType
        return node
      }

      assertTypes(lhs, rhs)
      return node
    }

    return lhs
  }

  // TODO: better conditionalOperator
  if (lexer.peek().type == 'conditionalOperator') {
    const lhs = operand
    const operator = lexer.next('conditionalOperator')
    const rhs = buildOperand(lexer, state, context)

    const assertions = lhs.dataType.type != 'literalNumber' || rhs.dataType.type != 'literalNumber'
    assertSpan(operand.span, assertions, 'Both number in conditional')

    return {
      type: 'conditional',
      lhs,
      rhs,
      dataType: boolType,
      operator: operator.token as ConditionalOperator,
      span: operand.span
    }
  }

  return operand
}

function buildFunction(lexer: Lexer, state: State, context: Context, retType: Type) {
  // parsing already started in parseDeclaration

  lexer.nextIs('function')
  const funName = lexer.next('string')
  context.unresolve(funName.span, funName.token)
  lexer.nextIs('(')

  // ID for entry and return statements
  const ID = nextInt()
  const entryID = funName.token == 'main' ? '__MAIN__' : `_fun_entry_${ID}`
  const retID = `_fun_ret_${ID}`

  solveLabel(state, context, retType.span, entryID)
  const bodyContext = createContext(context)

  // save the arguments required, signature
  const args = []

  while (lexer.peek().token != ')') {
    const type = buildType(lexer, state, context)
    const argName = lexer.next('string')

    context.unresolve(argName.token, argName.span)

    // only position and type must match, no named argument
    const register = bodyContext.addRegister(type, argName.token)

    args.push({
      type: 'argument',
      name: argName,
      dataType: type,
      register,
    })

    if (lexer.peek().token != ',') break
    lexer.nextIs(',')
  }

  lexer.nextIs(')')
  const fromName = lexer.next('string')
  const fromRegister = bodyContext.addRegister(addrType, fromName.token)

  // consumes { }
  bodyContext.locals.return = retType
  const body = parseBlock(lexer, state, bodyContext)
  assertSpan(body.end.span, body.returned, 'Function never returned')

  // TODO: check all registers have been saved
  solveLabel(state, context, retType.span, retID)

  const data = {
    span: body.end.span,
	rName: 'FUN_RET',
	rType: addrType.print
  }
  solveJMPR(state, context, data, fromRegister.name, 0)

  state.functions[funName.token] = {
    type: 'function',
    args,
    dataType: retType,
    name: funName,
    span: retType.span,
    entryID,
    bodyContext,
    fromRegister
  }

  return true
}

// return
function parseReturn(lexer: Lexer, state: State, context: Context) {
  if (lexer.peek().token == 'return') {
    const start = lexer.nextIs('return')
    const to = context.resolve('retAddr', start.span)
    const ret = context.resolve('return', start.span)

    if (to) {
      const returnReg = context.addRegister(to.dataType, 'return')

      const expr = buildExpression(lexer, state, context)
      solveExpression(state, context, returnReg, expr)
	    return returnReg

	  if (lexer.peek().token != '}') assertUnexpected(lexer.next())
    }
    // else is void type

    if (lexer.peek().token != '}') assertUnexpected(lexer.next())

    return 'returned'
  }
}

// definitions and declarations
function parseDeclaration(lexer: Lexer, state: State, context: Context): boolean | VariableOperand {
  const type = parseType(lexer, state, context)
  if (!type) return false

  const isGlobal = state.globalContext == context

  if (lexer.peek().token == 'function') {
    const message = 'Function can be declared only in global scope'
    assertSpan(type.span, isGlobal, message)

    return buildFunction(lexer, state, context, type)
  }

  const name = lexer.next('string')
  context.unresolve(name.span, name.token)


  // add to register scope
  if (!type.isStack) {
    const message = 'Varaibel with register can be declared only in non global scope'
    assertSpan(type.span, !isGlobal, message)

    lexer.nextIs('=')

    const expr = buildExpression(lexer, state, context)
    const register = context.addRegister(type, name.token)

    solveExpression(state, context, register, expr)

    return register
  }


  // no register => push on the stack or global
  const node: StackOrGlobalVariable = {
    type: isGlobal ? 'global' : 'stack',
    dataType: type,
    offset: context.stack.size,
    name: name.token,
    info: { defined: lexer.peek().token == '=' },
    span: type.span
  }

  // add to the locals and incraese it's size
  context.stack.names[name.token] = node
  context.stack.positions.push(node)
  context.stack.size += type.size

  if (lexer.peek().token == '=') {
    lexer.nextIs('=')

    const expr = buildExpression(lexer, state, context)

    if (isGlobal && expr.type == 'number' && expr.value != 0) {
      assert(node.type == 'global', 'Impossible')

      // if it's defined don't solve it here but hoist it
      node.expr = expr
      return node
    }

    solveExpression(state, context, node, expr)
    return node
  }

  return node
}

function parseDefine(lexer: Lexer, state: State, context: Context): Boolean {
  const start = lexer.peek()

  if (start.token == 'define') {

    let type = parseType(lexer, state, context)
    if (!type) type = literalType

    const name = lexer.next('string')
    lexer.nextIs('=')

    const expr = buildExpression(lexer, state, context) as Operand

    assertSpan(start.span, expr.type == 'number', 'Definition must be constant')
    context.unresolve(name.span, name.token)

    state.defines[name.token] = {
      type: 'number',
      dataType: type,
      value: expr.value,
      span: start.span
    }

    const a = {
      type: 'number',
      dataType: type,
      value: expr.value,
      span: start.span
    }

    solveComment(state, context, start.span, `// ${name.token} = ${expr.value}`)

    return true
  }

  return false
}

function solveFileStartEnd(state: State, context: Context, span: Span, type: string, name: string) {

  const middle = `# ${type} of '${name}' #`
  const filler = ''.padEnd(middle.length, '#')

  solveComment(state, context, span, '')
  solveComment(state, context, span, filler)
  solveComment(state, context, span, middle)
  solveComment(state, context, span, filler)
  solveComment(state, context, span, '')
}

function parseFileStartEnd(lexer: Lexer, state: State, context: Context): boolean {
  const edge = lexer.peek()
  if (edge.type == 'fileStart') {
    const start = lexer.next()

    solveFileStartEnd(state, context, start.span, 'Start', start.span.fileName)

    return true
  }

  if (edge.type == 'fileEnd') {
    const start = lexer.next()

    solveFileStartEnd(state, context, start.span, 'End', start.span.fileName)

    return true
  }

  return false
}

function parseInclude(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == 'include') {
    const start = lexer.nextIs('include')

    const name = lexer.next('stringLiteral')
    const file = sources[name.token]

    assertSpan(name.span, file, `Cannot resolve name ${name.token}`)
    solveComment(state, context, start.span, `include '${name.token}'`)

    lexer.unNext(file, name.token)

    return true
  }
  return false
}

function solveComment(state: State, context: Context, span: Span, comment: string) {
  const node = {
    span,
    print: comment,
    opcodes: []
  }

  state.program.push(() => node)
}

function parseComment(lexer: Lexer, state: State, context: Context): Boolean {
  const comment = lexer.peek()

  if (comment.type == 'comment') {

    if (state.defines.__PRINT_COMMENTS__?.value !== 0) {
      solveComment(state, context, comment.span, comment.token)
    }

    return true
  }

  return false
}

function parseTypedef(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == 'typedef') {
    const start = lexer.nextIs('typedef')

    const type = buildType(lexer, state, context)
    const name = lexer.next('string')

    context.unresolve(name.span, name.token)
    state.types[name.token] = {
      ...type,
      print: type.print.replace(type.name, name.token),
      span: start.span,
    }

    return true
  }

  return false
}

function parseConst(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == 'const') {
    const start = lexer.nextIs('const')

    const type = buildType(lexer, state, context)
    assertSpan(start.span, type.type == 'pointer', 'dataType of const must be pointer')

    const name = lexer.next('string')
    const label = name.token as LabelName
    lexer.nextIs('=')

    // ad the label to the constProgram instead
    solveLabel(state, context, name.span, label, type)
    state.constProgram.push(state.program.instructions.pop()!)

    function setLen(len: number) {
      const lenName = `${name.token}_len` as LabelName

      context.unresolve(start.span, lenName)
      state.defines[lenName] = {
        type: 'number',
        value: len,
        dataType: pointerDiffType,
        span: name.span
      }

      const endName = `${name.token}_end` as LabelName

      solveLabel(state, context, name.span, endName, type)
      state.constProgram.push(state.program.instructions.pop()!)

      if (len > 1) {
        solveComment(state, context, start.span, `// ${lenName} = ${len}`)
        state.constProgram.push(state.program.instructions.pop()!)
      }
    }

    const expr = buildExpression(lexer, state, context)

    if (expr.type == 'number') {
      solveDB(state, context, start.span, expr.value, expr.value.toString())
      state.constProgram.push(state.program.instructions.pop()!)

      setLen(1)
      return true
    }

    if (expr.type == 'string') {
      assertSpan(expr.span, type.print == 'char_t*', 'type must be char_t*')

      const len = expr.string.length
      expr.string.split('').forEach((char, i) => {
        const pre = i == 0 ? '"' : ' '
        const end = i == len - 1 ? '"' : ' '
        const value = char.charCodeAt(0)
        const print = pre + value + end
        solveDB(state, context, start.span, value, print)
        state.constProgram.push(state.program.instructions.pop()!)
      })

      setLen(len)
      return true
    }

    if (expr.type == 'array') {
      const array = expr.array
      const arrayType = type.to

      assertSpan(start.span, arrayType.type == 'basic', 'dataType of arrayLiteral mus be *basic')

      const len = array.length
      array.forEach((el, i) => {
        assertSpan(el.span, el.type == 'number', `Invalid element in array literal ${el.type}`)
        assertSpan(el.span, el.dataType.type == 'literalNumber', `Invalid element in array literal ${el.dataType.type}`)

        const pre = i == 0 ? '[' : ' '
        const end = i == len - 1 ? ']' : ' '
        const print = pre + el.value + end
        solveDB(state, context, el.span, el.value, print)
        state.constProgram.push(state.program.instructions.pop()!)
      })

      setLen(len)
      return true
    }

    assertSpan(expr.span, false, 'Cannot initialize const with non const expression')
  }

  return false
}

function solveDB(state: State, context: Context, span: Span, value: number, print: String) {
  const node: Instruction = {
    span: span,
    print: `db  ${print || value}`,
    opcodes: [{
      opcode: value,
      rType: 'literal',
      rName: `${value}`,
      exec: () => { throw 'Connot execute static data' },
      print: `${hex(value, 4, false)}`
    }]
  }

  state.program.push(() => node)
}

// assignment
function parseAssignment(lexer: Lexer, state: State, context: Context): boolean {
  const assign = lexer.peek().type == 'string' && lexer.peek(1).token == '='
  const access = lexer.peek().type == 'string' && lexer.peek(1).token == '.'
  const deref = lexer.peek().token == '*'

  if (assign || access || deref) {
    const to = buildOperand(lexer, state, context)

    const operator = lexer.nextIs('=')
    const expr = buildExpression(lexer, state, context)

    solveExpression(state, context, to, expr)

    return true
  }

  return false
}

function parseVoidFunCall(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().type == 'string' && lexer.peek(1).token == '(') {
    const fun = buildOperand(lexer, state, context)

    assertSpan(fun.span, fun.type == 'functionVariable', `Cannot call non function ${fun.type}`)
    assertSpan(fun.span, fun.dataType.type == 'void', `Function doesn't return void, '${fun.dataType.print}'`)

    solveJAL(state, context, fun.span, fun.function.beginLabel.name, fun.function.returnAddress.id)
    return true
  }

  return false
}

function parseEval(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().type == 'eval') {
    const body = lexer.next('eval')

    let ret
    try {
      const fun = new Function('lexer', 'state', 'context', body.token)
      ret = fun(lexer, state, context)
    } catch (e) {
      console.log(body);
      console.log(ret);
      console.log(e);
      assertSpan(body.span, false, 'Cannot resolve eval! more details in the console')
    }

    assertSpan(body.span, typeof ret !== 'undefined', 'Eval returned undefined')
    const value: string = ret.toString()

    const evalID = nextInt()
    const fileName = `_eval_${evalID}`
    lexer.unNext(value, fileName)

    if (state.defines.__PRINT_EVAL__?.value !== 0) {
      value.split('\n').forEach(line => {
        solveComment(state, context, body.span, `// ${line}`)
      })
    }

    return true
  }

  return false
}

// register interrogation
function buildRegisterInterrogation(lexer: Lexer, state: State, context: Context) {
  if (lexer.peek().token == '?') {
    const start = lexer.nextIs('?')
    let ret = 'Register interrogation:\n\n'

    assertUnimplemented('Register interrogation')

    /*
    Object.keys(state.registers.scope).forEach(name => {
      console.log(name);
      ret += `${name}: ${state.registers.scope[name].register.name}\n`
    })

    assertSpan(start.span, false, ret)
    */
  }
}

function solveRegisters(a: Register, b: Register, d: Register): number {
  const aReg = registersIndex.indexOf(a)
  const bReg = registersIndex.indexOf(b)
  const dReg = registersIndex.indexOf(d)
  assert(aReg != -1 && bReg != -1 && dReg != -1, 'Invalid register names')

  return dReg + (bReg << 3) + (aReg << 6)
}

function solveImmediate(imm: number, size: number) {
  const neg = imm < 0
  const max = 2 ** (size - 1)
  let ret = Math.abs(imm)

  assert(imm >= -max && imm < max, 'Invalid immediate: ' + imm)
  if (neg) {
    ret = max - ret
    // negative number start from -64 to -1

    // sign bit
    ret += 1 << (size - 1)
  }

  return ret
}

type TypeOpcodes = {
  [key in BaseBinaryType]: {
    code: number,
    print: string,
    exec: (a: number, b: number) => number
  }
}
const typeOpcodes: TypeOpcodes = {
  '+': {
    code: 65,
    print: 'ADD',
    exec: (a, b) => a + b
  },
  '-': {
    code: 65,
    print: 'SUB',
    exec: (a, b) => a - b
  },
  '&': {
    code: 67,
    print: 'AND',
    exec: (a, b) => a & b
  },
  '|': {
    code: 67,
    print: 'OR',
    exec: (a, b) => a | b
  },
  '^': {
    code: 67,
    print: 'XOR',
    exec: (a, b) => a ^ b
  }
} as const

function solveRRR(state: State, context: Context, to: RegisterID, lhs: RegisterID, rhs: RegisterID, type: BaseBinaryType) {
  state.program.push(info => {
    const aReg = info.getReg(lhs)
    const bReg = info.getReg(rhs)
    const dReg = info.getReg(to)

    const a = aReg.register
    const b = bReg.register
    const d = dReg.register

    const {code, exec, print} = typeOpcodes[type]
    let opcode = solveRegisters(a, b, d)
    opcode += code

    return {
      span: aReg.span,
      print: `${print} ${dReg.name}, ${aReg.name}, ${bReg.name}`,
      opcodes: [{
        opcode,
        rType: dReg.type.print,
        rName: dReg.name,
        exec: s => s.alu(a, b, d, exec),
        print: `${hex(opcode, 4, false)}: I ${print.padEnd(3)}       ${a} ${b} ${d}`
      }]
    }
  })
}

// 3op 1s 5:0 3b 3d
function solveADI(state: State, context: Context, to: RegisterID, lhs: RegisterID, imm: number) {
  const immCode = solveImmediate(imm, 7)

  state.program.push(info => {
    const bReg = info.getReg(lhs)
    const dReg = info.getReg(to)

    const b = bReg.register
    const d = dReg.register

    let opcode = solveRegisters('r0', b, d)
    opcode += immCode << 6

    return {
      span: dReg.span,
      print: `adi ${d}, ${b}, ${imm}`,
      opcodes: [{
        opcode,
        rType: dReg.type.print,
        rName: dReg.name,
        exec: s => s.alu('r0', b, d, (a, b) => b + imm),
        print: `${hex(opcode, 4, false)}: I ADI ${hex(imm, 2)}    ${bReg.name} ${dReg.name}`
      }]
    }
  })
}

function solveLUI(state: State, context: Context, to: RegisterID, imm: number) {
  assert(imm > 0 && imm < (1 << 16) && !(imm & 63), 'Invalid immedaite in LUI')

  state.program.push(info => {
    const dReg = info.getReg(to)

    const d = dReg.register

    let opcode = solveRegisters('r0', 'r0', d)
    opcode += imm >> 4

    return {
      span: dReg.span,
      print: `lui ${d}, ${imm}`,
      opcodes: [{
        opcode,
        rType: dReg.type.print,
        rName: dReg.name,
        exec: s => s.alu('r0', 'r0', d, (a, b) => imm),
        print: `${hex(opcode, 4, false)}: U LUI ${hex(imm, 4)}     ${dReg.name}`
      }]
    }
  })
}

function solveLDI(state: State, context: Context, to: RegisterID, imm: number) {
  let lower = imm & 127
  let upper = imm - lower

  if (lower > 63) {
    upper += 128
    lower -= 128

    upper = upper % (1 << 16)
  }

  state.program.push(info => {
    const dReg = info.getReg(to)

    const opcodes = []

    if (upper) {
      solveLUI(state, context, to, upper)
      const lui = state.program.instructions.pop()!(info)
      opcodes.push(lui.opcodes[0])
    }

    if (lower || !upper) {
      const from = upper ? to : r0ID
      solveADI(state, context, to, from, lower)
      const adi = state.program.instructions.pop()!(info)
      opcodes.push(adi.opcodes[0])
    }

    return {
      span: dReg.span,
      print: `ldi ${dReg.name}, ${imm}`,
      opcodes
    }
  })
}

function solveLDI_LABEL(state: State, context: Context, to: RegisterID, label: LabelName) {
  state.program.push(info => {
    const dReg = info.getReg(to)

    const imm = info.solveLabel(label)

    solveLDI(state, context, to, imm)

    const LDI = state.program.instructions.pop()!(info)

    return {
      span: dReg.span,
      print: `ldi ${dReg.name}, ${label}`,
      opcodes: LDI.opcodes
    }
  })
}

function solveLOD(state: State, context: Context, to: RegisterID, from: RegisterID, imm: number) {
  const immCode = solveImmediate(imm, 7)

  state.program.push(info => {
    const bReg = info.getReg(from)
    const dReg = info.getReg(to)

    const b = bReg.register
    const d = dReg.register

    let opcode = solveRegisters('r0', b, d)
    opcode += immCode << 6

    return {
      span: dReg.span,
      print: `lod ${d}, ${b}[${imm}]`,
      opcodes: [{
        opcode,
        rType: dReg.type.print,
        rName: dReg.name,
        exec: s => s.alu('r0', b, d, (a, index) => s.readMemory(index + imm)),
        print: `${hex(opcode, 4, false)}: I LOD ${hex(imm, 2)}    ${b} ${d}`
      }]
    }
  })
}

function solveSTO(state: State, context: Context, to: RegisterID, from: RegisterID, imm: number) {
  const immCode = solveImmediate(imm, 7)

  state.program.push(info => {
    const aReg = info.getReg(from)
    const bReg = info.getReg(to)

    const a = aReg.register
    const b = bReg.register

    let opcode = solveRegisters(a, b, 'r0')
    opcode += (immCode & 0b0000111) << 0
    opcode += (immCode & 0b1111000) << 6

    return {
      span: bReg.span,
      print: `sto ${b}[${imm}], ${a}`,
      opcodes: [{
        opcode,
        rType: bReg.type.print,
        rName: bReg.name,
        exec: s => s.alu(a, b, 'r0', (value, index) => {
          s.writeMemory(index + imm, value)
          return 0
        }),
        print: `${hex(opcode, 4, false)}: I STO ${hex(imm, 2)} ${a} ${b}`
      }]
    }
  })
}

function solveExpression(state: State, context: Context, to: Operand, expr: Operand) {
  if (expr.dataType.type == 'literalNumber') {
    const assertion = to.dataType.type == 'basic'
    const error = `Cannot set immediate to ${to.dataType.print}`
    assertSpan(to.span, assertion, error)
  } else {
    assertTypes(to, expr)
  }

  if (to.type == 'register') {
    if (expr.type == 'number') {
      solveLDI(state, context, to.id, expr.value)
      return
    }

    if (expr.type == 'deref') {
      solveLOD(state, context, to.id, expr.of.id, expr.offset)
      return
    }

    if (expr.type == 'label') {
      solveLDI_LABEL(state, context, to.id, expr.name)
      return
    }

    if (expr.type == 'binary') {
      if (expr.lhs.type == 'register') {
        const lReg = expr.lhs.id

        if (expr.rhs.type == 'number') {
          if (expr.operator == '-') {
            solveADI(state, context, to.id, lReg, -expr.rhs.value)
            return
          }

          if (expr.operator == '+') {
            solveADI(state, context, to.id, lReg, expr.rhs.value)
            return
          }
        }

        if (expr.rhs.type == 'register') {
          solveRRR(state, context, to.id, lReg, expr.rhs.id, expr.operator)
          return
        }
      }
    }

    if (expr.type == 'register') {
      solveADI(state, context, to.id, expr.id, 0)
      return
    }

    if (expr.type == 'stack') {
      assertSpan(expr.span, expr.info.defined, `The global variable '${expr.name}' is declared but not defined`)

      solveLOD(state, context, to.id, spID, expr.offset)
      return
    }

    if (expr.type == 'global') {
      assertSpan(expr.span, expr.info.defined, `The global variable '${expr.name}' is declared but not defined`)

      solveLOD(state, context, to.id, r0ID, expr.offset)
      return
    }

    if (expr.type == 'functionCall') {
      const fun = expr.function

      solveJAL(state, context, fun.span, fun.beginLabel.name, fun.returnAddress.id)
      return
    }
  }

  if (to.type == 'deref') {
    if (expr.type == 'number') {
      assertSpan(expr.span, expr.value == 0, 'Can store only with register or 0')

      solveSTO(state, context, to.of.id, r0ID, to.offset)
      return
    }

    if (expr.type == 'register') {
      solveSTO(state, context, to.of.id, expr.id, to.offset)
      return
    }
  }

  if (to.type == 'stack') {
    to.info.defined = true

    if (expr.type == 'number') {
      assertSpan(expr.span, expr.value == 0, 'Can store only with register or 0')

      solveSTO(state, context, spID, r0ID, to.offset)
      return
    }

    if (expr.type == 'register') {
      solveSTO(state, context, spID, expr.id, to.offset)
      return
    }
  }

  if (to.type == 'global') {
    to.info.defined = true

    if (expr.type == 'number') {
      assertSpan(expr.span, expr.value == 0, 'Can store only with register or 0')
      solveSTO(state, context, r0ID, r0ID, to.offset)
      return
    }

    if (expr.type == 'register') {
      solveSTO(state, context, r0ID, expr.id, to.offset)
      return
    }
  }

  const lhs = getAssertTypesMessage(to)
  const rhs = getAssertTypesMessage(expr)
  assertSpan(to.span, false, `Cannot assign '${lhs}' to '${lhs}'`)
}

function solveJMP(state: State, context: Context, span: Span, to: LabelName) {
  solveJAL(state, context, span, to, r0ID)
}

function solveJAL(state: State, context: Context, span: Span, to: LabelName, link: RegisterID) {
  state.program.push(info => {
    const dReg = info.getReg(link)
    const d = dReg.register

    const imm = info.solveLabel(to)

    let opcode = solveRegisters('r0', 'r0', d)

    return {
      span,
      print: `JAL ${to}, ${d}`,
      opcodes: [{
        opcode,
        exec: s => s.alu('r0', 'r0', d, (a, b) => {
          const pc = s.pc
          s.pc = imm
          return pc
        }),
        rName: dReg.name,
        rType: dReg.type.print,
        print: `${hex(opcode, 4, false)}: J JAL ${hex(imm, 4)}     ${d}`
      }]
    }
  })
}

function solveJALR(state: State, context: Context, span: Span, to: RegisterID, link: RegisterID) {

  state.program.push(info => {
    const dReg = info.getReg(link)
    const bReg = info.getReg(to)

    const d = dReg.register
    const b = bReg.register

    let opcode = solveRegisters('r0', b, d)
    // const immCode = solveImmediate(imm, 9)

    return {
      span,
      print: `jalr ${b}, ${d}`,
      opcodes: [{
        opcode,
        exec: s => s.alu('r0', b, d, (a, dest) => {
          const ret = s.pc
          s.pc = dest
          return ret
        }),
        rName: dReg.name,
        rType: dReg.type.print,
        print: `${hex(opcode, 4, false)}: J JALR        ${b} ${d}`
      }]
    }
  })
}

function solveBNC(state: State, context: Context, span: Span, type: CodntionalJump, to: LabelName) {
  function takeJump(s: Simulation): boolean {
    switch (type) {
      case 'bnz': return !s.flags.z
      case 'bz':  return  s.flags.z
      case 'bnc': return !s.flags.c
      case 'bc':  return  s.flags.c
      case 'bnn': return !s.flags.n
      case 'bn':  return  s.flags.n
    }
  }

  let opcode = solveRegisters('r0', 'r0', 'r0')

  state.program.push(info => {
    const imm = info.solveLabel(to)

    return {
      span,
      print: `${type} ${to}`,
      opcodes: [{
        opcode,
	    	rType: '',
	    	rName: '',
        exec: s => s.alu('r0', 'pc', 'pc', (a, pc) => takeJump(s) ? imm : pc),
        print: `${hex(opcode, 4, false)}: J ${type.toUpperCase().padEnd(3)} ${hex(imm, 4)}`
      }]
    }
  })
}

// BGE, BLT, BE, BNE
const synthesizer = {'bl': 'bg', 'ble': 'bge', 'bge': 'ble', 'bg': 'bl', 'be': 'be', 'bne': 'bne'} as const

function solveCMP(state: State, context: Context, span: Span, lhs: Operand, operator: BranchName, rhs: Operand, to: LabelName) {

  function solve(lhs: Operand, operator: BranchName, rhs: Operand) {
    if (lhs.type == 'number') {
      solve(rhs, synthesizer[operator], lhs)
      return
    }

    if (operator == 'ble' || operator == 'bg') {
      if (rhs.type == 'register') {
        solve(rhs, synthesizer[operator], lhs)
        return
      }

      assertSpan(rhs.span, rhs.type == 'number', `Can compare only register or number but got: '${rhs.type}'`)

      rhs.value++

      solve(lhs, operator == 'bg' ? 'bge' : 'bl', rhs)
      return
    }

    assertSpan(lhs.span, lhs.type == 'register', `one must be register but got '${lhs.type}'`)

    state.program.push(info => {
      const opcodes = []

      if (rhs.type == 'number') {
        solveADI(state, context, r0ID, lhs.id, -rhs.value)
      } else {
        assertSpan(lhs.span, rhs.type == 'register', `one must be register but got '${lhs.type}'`)
        solveRRR(state, context, r0ID, lhs.id, rhs.id, '-')
      }

      const sub = state.program.instructions.pop()!(info)
      opcodes.push(...sub.opcodes)

      const jmpName = {'bge': 'bnc', 'bl': 'bc', 'bne': 'bnz', 'be': 'bz'} as const
      solveBNC(state, context, span, jmpName[operator], to)

      const bnc = state.program.instructions.pop()!(info)
      opcodes.push(...bnc.opcodes)

      const rToken = rhs.type == 'number' ? rhs.value : rhs.name
      return {
        span: span,
        print: `${operator} ${lhs.name}, ${rToken}`,
        opcodes
      }
    })
  }

  solve(lhs, operator, rhs)
}

const inverter = {'>': '<=', '>=': '<', '==': '!=', '<=': '>', '<': '>=', '!=': '=='} as const
const branchName = {'>': 'bg', '>=': 'bge', '==': 'be', '<=': 'ble', '<': 'bl', '!=': 'bne'} as const

type BranchSymbol = keyof typeof inverter
type BranchName = typeof branchName[BranchSymbol]

type LabelOrNull = LabelName | null
function solveCondition(state: State, context: Context, condition: Operand, ifTrue: LabelOrNull, ifFalse: LabelOrNull) {
  function solve(lhs: Operand, operator: ConditionalOperator, rhs: Operand, ifTrue: LabelOrNull, ifFalse: LabelOrNull): void {
    assert(ifTrue || ifFalse, 'Unreachable')

    // if the branch is taken only if the condition is false
    if (!ifTrue) return solve(lhs, inverter[operator], rhs, ifFalse, null)

    assert(lhs.type != 'number' || rhs.type != 'number', 'Not implemented')
    assertSpan(lhs.span, lhs.type == 'register' || lhs.type == 'number', `expected 'number | register' but got ${lhs.type}`)
    assertSpan(rhs.span, rhs.type == 'register' || rhs.type == 'number', `expected 'number | register' but got ${rhs.type}`)

    const type = branchName[operator]

    solveCMP(state, context, condition.span, lhs, branchName[operator], rhs, ifTrue)

    if (ifFalse) solveJMP(state, context, condition.span, ifFalse)
  }

  if (condition.type == 'conditional') {
    return solve(condition.lhs, condition.operator, condition.rhs, ifTrue, ifFalse)
  }

  if (condition.type == 'register') {
    const rhs: Operand = {
      type: 'number',
      value: 0,
      span: condition.span,
      dataType: literalType
    }

    return solve(condition, '!=', rhs, ifTrue, ifFalse)
  }

  console.log(condition)
  assertUnimplemented(`condition of type ${condition.type}`)
}

function parseAnonymousBlock(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == '{')  {

    const fork = context.fork()
    const block = parseBlock(lexer, state, fork.split())
    fork.join()

    return true
  }

  return false
}

function parseIf(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == 'if') {

    const begin = lexer.nextIs('if')

    const id = nextInt()
    const elseID = `_if_else_${id}` as LabelName
    const endID = `_if_end_${id}` as LabelName

    const preProgram = state.program.take()

    lexer.nextIs('(')
    const condition = buildExpression(lexer, state, context)
    lexer.nextIs(')')

    const fork = context.fork()
    const trueContext = parseBlock(lexer, state, fork.split())
    const trueProgram = state.program.take()

    if (lexer.peek().token == 'else') {
      const elseToken = lexer.nextIs('else')

      const falseContext = parseBlock(lexer, state, fork.split())
      const falseProgram = state.program.take()

      state.program.append(preProgram)
      solveCondition(state, context, condition, null, elseID)
      state.program.append(trueProgram)

      solveJMP(state, context, elseToken.span, endID)

      solveLabel(state, context, elseToken.span, elseID)
      state.program.append(falseProgram)
      solveLabel(state, context, falseContext.end, endID)

      fork.join()
      return true
    }

    // if without else
    state.program.append(preProgram)
    solveCondition(state, context, condition, null, endID)
    state.program.append(trueProgram)

    solveLabel(state, context, trueContext.end, endID)

    fork.join()
    return true
  }

  return false
}

function parseFor(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == 'for') {
    const start = lexer.nextIs('for')
    const ifID = nextInt()
    const startID = `_for_start_${ifID}` as LabelName
    const endID = `_for_end_${ifID}` as LabelName

    lexer.nextIs('(')

    const definition = parseDeclaration(lexer, state, context)
    assertSpan(start.span, typeof definition != 'boolean', 'Invalid definition')
    assertSpan(definition.span, definition.type == 'register', 'Invalid definition')

    lexer.nextIs(';')

    solveLabel(state, context, definition.span, startID)
    const condition = buildExpression(lexer, state, context)
    assertSpan(condition.span, condition.type == 'conditional', 'Not a comparation')
    solveCondition(state, context, condition, null, endID)

    lexer.nextIs(';')

    const preProgram = state.program.take()
    const increment = parseAssignment(lexer, state, context)
    assertSpan(start.span, increment, 'Invalid increment')
    const incrementProgram = state.program.take()
    state.program.append(preProgram)

    lexer.nextIs(')')

    const fork = context.fork()
    const block = parseBlock(lexer, state, fork.split())
    state.program.append(incrementProgram)

    solveJMP(state, context, block.begin, startID)

    solveLabel(state, context, block.end, endID)

    fork.join()
    return true
  }

  return false
}

function solveEntryDefinitions(lexer: Lexer, state: State, context: Context) {
  if (context.stack.size) {
    solveADI(state, context, spID, spID, -context.stack.size)
  }
}

function solveExitDefinitions(lexer: Lexer, state: State, context: Context) {
  if (context.stack.size) {
    solveADI(state, context, spID, spID, context.stack.size)
  }
}

function parseASM(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == 'asm') {
    const start = lexer.nextIs('asm')
    lexer.nextIs('{')

    while (lexer.peek()) {
      const next = lexer.next()
      if (next.token == '}') break

      if (conditionalJump.includes(next.token as CodntionalJump)) {
        const label = lexer.next('string').token as LabelName

        solveBNC(state, context, next.span, next.token as CodntionalJump, label)
        continue
      }

      if (next.token == 'jmp') {
        const label = lexer.next('string').token as LabelName

        const to = lexer.next('string')
        solveJMP(state, context, next.span, label)
        continue
      }

      if (lexer.peek().token == ':') {
        lexer.next()
        solveLabel(state, context, next.span, next.token as LabelName)

        continue
      }

      assertSpan(next.span, false, `Invalid ASM token: '${next.token}'`)
    }

    return true
  }

  return false
}

/*
  - First element of Context is always an entry node, it denotes the
      variables used inside or beyond the block that come from before the block
  - DeclareNode declares a new Register with it's ID
  - Use just uses a previously declared Register, allows for shadowing
  - SplitNode is before a split where new separate contexts are neded
  - JoinNode is when multiple contexts merge, all previous node declaration are deleted
  - When there is a retur they merge in the same ID, that is declared after the join
     in a DeclareNode but used before that
*/

type BaseNode = { type: string, span: Span }
type EntryNode = BaseNode & { type: 'entry', entries: RegisterID[], next: RegOrNullNode, prev: RegOrNullNode }
type DeclareNode = BaseNode & { type: 'declare', id: RegisterID, value: RegisterVariable, isLast: boolean, next: RegOrNullNode, prev: RegOrNullNode }
type UseNode = BaseNode & { type: 'use', id: RegisterID, value: RegisterVariable, isLast: boolean, next: RegOrNullNode, prev: RegOrNullNode }
type SplitNode = BaseNode & { type: 'split', joinNode: JoinNode | null, children: EntryNode[], prev: RegisterNode }
type JoinNode = BaseNode & { type: 'join', splitNode: SplitNode, parents: RegisterNode[], next: RegOrNullNode }

type RegisterNode = EntryNode | DeclareNode | UseNode | SplitNode | JoinNode
type RegOrNullNode = RegisterNode | null

type Context = {
  resolve: (span: Span, name: string, noRegNode?: boolean) => VariableOperand | FunctionVariable
  unresolve: (span: Span, name: string, noRegNode?: boolean) => void
  addRegister: (span: Span, name: string, type: Type) => RegisterVariable
  entryNode: EntryNode,
  lastNode: RegisterNode,
  fork: (span: Span) => {
    split: (span: Span) => Context,
    join: (span: Span) => void
  }
  stack: {
    size: number,
    names: {[key: string]: StackOrGlobalVariable | undefined}
    positions: StackOrGlobalVariable[]
  }
  begin: Span,
  end: Span
}

function solveChain(node: RegOrNullNode, id: RegisterID): DeclareNode | UseNode | null {
  while (node) {
    switch (node.type) {
      case 'declare':
      case 'use':
        if (node.id == id) return node
        continue

      case 'join':
        node = node.splitNode
        continue

      case 'entry':
      case 'split':
        node = node.prev
        continue

      default:
        assertUnreachable(node)
    }
  }

  return node // null
}

function addToChain(context: Context, element: DeclareNode | UseNode | SplitNode) {
  function walkBranch(node: RegOrNullNode) {
    assert(element.type != 'split', 'Impossible')

    while (node) {
      switch (node.type) {
        case 'declare':
        case 'use':
          if (node.id == element.id) {
            node.isLast = false
            return
          }

          node = node.prev
          continue

        case 'entry':
          node.entries.push(element.id)
          node = node.prev
          continue

        case 'split':
          break

        case 'join':
          node.parents.forEach(parent => walkBranch(parent))
          walkBranch(node.splitNode)
          break

        default:
          assertUnreachable(node)
      }
    }

    assertSpan(element.value.span, false, 'Invalid node insertion')
  }

  const last = context.lastNode

  switch (last.type) {
    case 'entry':
    case 'declare':
    case 'use':
    case 'join':
      last.next = element
      break

    case 'split':
      assert(false, 'Last element was split? no entry?')

    default:
      assertUnreachable(last)
  }

  context.lastNode = element

  if (element.type == 'use') {
    walkBranch(context.lastNode)
  }
}

function getToEnd(head: RegisterNode): RegisterNode {
  let lastNode = head
  let node: RegOrNullNode = head
  while (node) {
    lastNode = node
    switch (node.type) {
      case 'entry':
      case 'declare':
      case 'use':
      case 'join':
        node = node.next
        continue

      case 'split':
        node = node.joinNode
        continue

      default:
        assertUnreachable(node)
    }
  }

  return lastNode
}

function createContext(parent: Context): Context {
  const entryNode: EntryNode = {
    type: 'entry',
    entries: [],
    prev: parent.lastNode,
    next: null,
    span: basicSpan
  }

  const context: Context = {
    stack: {
      size: 0,
      positions: [],
      names: {}
    },
    begin: basicSpan,
    end: basicSpan,
    lastNode: entryNode,
    entryNode,
    resolve: (span: Span, name: string, noRegNode?: boolean) => {
      if (!noRegNode) {
        const node = solveChain(context.lastNode, name as RegisterID)
        if (node) {
          addToChain(context, {
            type: 'use',
            id: node.id,
            prev: context.lastNode,
            value: node.value,
            isLast: true,
            next: null,
            span
          })
          return node.value
        }
      }

      const stack = context.stack.names[name]
      if (stack) return stack

      const ret = parent.resolve(span, name, true)

      assertSpan(span, ret || noRegNode, `Unable to resolve name '${name}'`)

      return ret
    },
    unresolve: (span: Span, name: string) => {
      const node = solveChain(context.lastNode, name as RegisterID)!
      assertSpan(span, !node, `Cannot redifine register '${node.value.name} defined at: ${node.value.span.print}`)

      const upper = context.resolve(span, name, true)
      if (!upper) return

      const message = getAssertTypesMessage(upper)
      assertSpan(span, false, message)
    },
    addRegister: (span: Span, name: string, type: Type) => {
      context.unresolve(span, name)

      const id = `${name}_${nextInt()}` as RegisterID

      const node: RegisterVariable = {
        name,
        span,
        dataType: type,
        type: 'register',
        id
      }

      addToChain(context, {
        type: 'declare',
        id: id,
        prev: context.lastNode,
        value: node,
        isLast: true,
        next: null,
        span
      })

      return node
    },
    fork: (span: Span) => {
      const splitNode: SplitNode = {
        type: 'split',
        prev: context.lastNode,
        joinNode: null,
        children: [],
        span
      }

      addToChain(context, splitNode)

      function split() {
        assert(context.lastNode == splitNode, 'Invalid split')

        const child = createContext(context)
        child.lastNode.span = span

        splitNode.children.push(child.entryNode)
        return child
      }

      function join(span: Span) {
        assert(context.lastNode == splitNode, 'Invalid split')

        const joinNode: JoinNode = {
          type: 'join',
          parents: [],
          splitNode,
          next: null,
          span
        }

        // go through each child to find the end
        splitNode.children.forEach(child => {
          const node = getToEnd(child)

          joinNode.parents.push(node)
        })

        splitNode.joinNode = joinNode
        context.lastNode = joinNode
      }

      return {
        split,
        join
      }
    }
  }

  return context
}

// A block is inside { and }
function parseBlock(lexer: Lexer, state: State, context: Context): Context {
  const preProgram = state.program.take()

  context.begin = lexer.nextIs('{').span

  while (lexer.peek().token && lexer.peek().token != '}') {

        // { }
    if (parseAnonymousBlock(lexer, state, context)) continue

    // indicate start & end of file
    if (parseFileStartEnd(lexer, state, context)) continue

    // if (a > 5) {b = 9}
    if (parseIf(lexer, state, context)) continue

    // for (int i as a = 9; i < 10; i++) { b = i }
    if (parseFor(lexer, state, context)) continue

    // assignment, a = b, a = 5
    if (parseAssignment(lexer, state, context)) continue

    // fun()
    if (parseVoidFunCall(lexer, state, context)) continue

    // declare context or register variable
    if (parseDeclaration(lexer, state, context)) continue

    // eval(Math.floor(Math.random() * 100))
    if (parseEval(lexer, state, context)) continue

    // asm { mov a, b }
    if (parseASM(lexer, state, context)) continue

    // single line or /* multiline */ comments
    if (parseComment(lexer, state, context)) continue

    if(parseReturn(lexer, state, context)) break

    // ?, stop compiling and show which register are used and by whom
    buildRegisterInterrogation(lexer, state, context)

    // Invalid input syntax
    assertUnexpected(lexer.next())
  }

  context.end = lexer.nextIs('}').span

  // add stack allocation and deallocation
  const blockProgram = state.program.take()
  state.program.append(preProgram)
  solveEntryDefinitions(lexer, state, context)
  state.program.append(blockProgram)
  solveExitDefinitions(lexer, state, context)


  return context
}

function buildGlobal(lexer: Lexer, state: State) {

  const context = state.globalContext
  context.begin = basicSpan
  context.end = basicSpan

  solveLabel(state, context, basicSpan, '__HEAP_START__' as LabelName)
  const heapStartLabel = state.program.take()

  while (lexer.peek().token) {
    // define MAX_COUNT = 69
    if (parseDefine(lexer, state, context)) continue

    // include 'salve.f'
    if (parseInclude(lexer, state, context)) continue

    // struct name { int field1 }
    // if (parseStruct(lexer, state, context)) continue

    // const int salve = 9
    if (parseConst(lexer, state, context)) continue

    // typedef int char
    if (parseTypedef(lexer, state, context)) continue

    // indicate start & end of file
    if (parseFileStartEnd(lexer, state, context)) continue

    // single line or /* multiline */ comments
    if (parseComment(lexer, state, context)) continue

    // declare context or register variable
    if (parseDeclaration(lexer, state, context)) continue

    assertUnexpected(lexer.next())
  }


  const globalProgram = state.program.take()

  // set stack pointer to top of ram
  solveLDI(state, context, spID, 0b0111_1111_1111_1111)

  // global context locals entry don't need stack allocation
  // all global locals are in heap space, they can be defined
  // at program initialization

  if (context.stack.size) {
    solveComment(state, context, basicSpan, '// GLOBAL VARIABLES:')
  }

  let heapSize = 0
  context.stack.positions.forEach(declaration => {
    assert(declaration.type == 'global', 'Impossible')

    heapSize += declaration.dataType.size
    solveComment(state, context, basicSpan, `// ${declaration.dataType.print} ${declaration.name}`)

    // cannot check .defioned because it will be set in program
    if (declaration.expr) {
      const expr = declaration.expr

      // split number load into register load and store
      if (expr.type == 'number' && expr.value != 0) {

        const to = {...declaration, span: basicSpan}

        const register: RegisterVariable = {
          type: 'register',
          dataType: declaration.dataType,
          span: declaration.span,
          name: 'TEMP_LOAD',
          id: raID
        }

        solveExpression(state, context, register, declaration.expr)
        solveExpression(state, context, to, register)
        return
      }

      solveExpression(state, context, declaration, declaration.expr)
    }
  })

  state.labels['__HEAP_START__' as LabelName]!.value = context.stack.size

  assert(state.functions.main, 'No main function found!!!')
  solveJMP(state, context, basicSpan, '__MAIN__' as LabelName)
  state.program.append(globalProgram)

  solveFileStartEnd(state, context, basicSpan, 'Start', 'CONST DATA')
  state.program.append(state.constProgram)
  solveFileStartEnd(state, context, basicSpan, 'End', 'CONST DATA')

  return state
}

function build(tokens: Token[]) {
  const lexer = getTokenLexer(tokens)

  const state: State = {
    defines: {},
    functions: {},
    labels: {},
    constProgram: [],
    executable: [],
    simulation: null,
    printable: {
      addresses: {},
      lines: []
    },
    program: {
      instructions: [],
      result: [],
      push: inst => state.program.instructions.push(inst),
      take: () => state.program.instructions.splice(0),
      append: (newInsts) => {
        const insts = state.program.instructions
        insts.splice(insts.length, 0,...newInsts)
      }
    },
    types: {
      word: wordType,
      void: voidType
    },
    globalContext: createContext({
      resolve: (span: Span, name: string, _?:boolean) => {

        if (state.defines[name]) return state.defines[name]
        if (state.types[name]) return state.types[name]
        if (state.labels[name as LabelName]) return state.labels[name as LabelName]
        if (state.functions[name]) return state.functions[name]

        return false
      }
    } as Context)
  }

  console.log(state);
  return buildGlobal(lexer, state)
}

////////////////////////////////////////////////////////////////////////////////
/*                         --- Solve     ---                                  */
////////////////////////////////////////////////////////////////////////////////


// const instInverter = {'>': '<', '<=': '>='}
// function solveCondition(state, context, condition, ifTrue, ifFalse) {
//
//   function solve(lhs, operator, rhs, ifTrue, ifFalse) {
//     assert(ifTrue || ifFalse, 'Unreachable')
//
//     // if the branch is taken only if the condition is false
//     if (!ifTrue) return solve(lhs, inverter[operator], rhs, ifFalse)
//
//     // synthesize BGT and BLE from BLT and BGE, no need to?
//     BGE = N, BLT = N || BGE => a >= b => a - b => miga la C flag.
//     BLT = a < b = a - b = C flag. C, Z,
//     Sa le numebr sa po cambia la costante a > 7 = a >= 8
//     if (instInverter[operator]) return solve(rhs, instInverter[operator], lhs, ifTrue, ifFalse)
//     const a = assertLookup(state, lhs).regName
//     const b = assertLookup(state, rhs).regName
//
//     const type = bncType[operator]
//     state.program.push({type, a, b, d: 'r0', span: condition.lhs.span, to: ifTrue})
//   }
//
//   solve(condition.lhs, condition.operator.token, condition.rhs, ifTrue, ifFalse)
// }

////////////////////////////////////////////////////////////////////////////////
/*                         --- Assemble ---                                   */
////////////////////////////////////////////////////////////////////////////////

// add d, a, b      | d = a + b
// mov a, b         | a = b
// mov [a + 5], b   | store b at address a + 5
// mov b, [a + 5]   | load address a + 5 in b
// jge a, b, label  | if a >= b goto label

// Memory layout
// restriction => EEPROM must be on the edge, VRAM is in the middle
// end = hardware memory
// start => fast access
// sa ram le al inizzi ta gas an 'first page' da 64 bytes, fast non register variables?
// RAM = 64 + 6 variables => auto register allocation?
// EEPROM = fast constant access?
// EEPROM sa po espanda cun la sd, ram le fis, eeprom le noma an bootloader

function hex(number: number, length: number, canBeNegative = true) {
  let ret = canBeNegative ? (number < 0 ? '-' : ' ') : ''

  ret += '0x' + Math.abs(number).toString(16).padStart(length, '0').toUpperCase()
  return ret
}

function registersOpcode(a: Register, b: Register, d: Register) {
  const aReg = registersIndex.indexOf(a)
  const bReg = registersIndex.indexOf(b)
  const dReg = registersIndex.indexOf(d)
  assert(aReg != -1 && bReg != -1 && dReg != -1, 'Invalid register names')

  return dReg + (bReg << 3) + (aReg << 6)
}

// size is the int size, signed in msb

function assemble(state: State) {
  // solve register selection

  const map: {[key: RegisterID]: RegisterInfo | undefined} = {}

  function solveBranch(entry: EntryNode) {
    const available = [...availableRegs]

    // used in other branches
    entry.entries.forEach(entry => {
      const reg = map[entry]
      assert(reg, 'Impossible')

      available.filter(el => el != reg.register)
    })

    let node: RegOrNullNode = entry.next

    while (node) {
      switch (node.type) {
        case 'declare':
          const reg = available.shift()
          assertSpan(node.value.span, reg, 'No reg left!')

          map[node.id] = {
            register: reg,
            name: node.value.name,
            type: node.value.dataType,
            span: node.span
          }

          if (node.isLast) {
            available.unshift(reg)
          }

          continue

        case 'use':
          if (node.isLast) {
            const reg = map[node.id]
            assert(reg, 'Impossible')
            available.unshift(reg.register)
          }

          continue


        case 'entry':
          assert(false, 'Impossible')

        case 'split':
          node.children.forEach(child => solveBranch(child))
          assert(node.joinNode, 'Impossible')
          node = node.joinNode.next
          continue

        case 'join':
          break

        default:
          assertUnreachable(node)
      }
    }
  }

  solveBranch(state.functions.main!.function.context.entryNode)

  // solve opcodes
  const r0Info: RegisterInfo = {
    register: 'r0' as AvailableRegs,
    name: 'r0',
    type: wordType,
    span: basicSpan
  }

  const spInfo: RegisterInfo = {
    register: 'sp' as AvailableRegs,
    name: 'sp',
    type: wordType,
    span: basicSpan
  }

  const raInfo: RegisterInfo = {
    register: 'ra',
    name: 'ra',
    type: wordType,
    span: basicSpan
  }

  type Resolver = {
    resolver: OpcodeResolver,
    result: Instruction | null
  }
  const resolvers: Resolver[] = state.program.instructions.map(r => ({resolver: r, result: null}))

  let lastLabels, newLabels, i = 0
  do {
    assert(i++ < 10, 'Compiling more than 10 passes?')
    lastLabels = newLabels

    const info: Info = {
      pc: PROGRAM_ENTRY_POINT,
      getReg: name => {
        if (name == 'r0') return r0Info
        if (name == 'sp') return spInfo
        if (name == 'ra') return raInfo

        const reg = map[name]
        assert(reg, 'Impossible')
        return reg
      },
      solveLabel: labelName => {
        if (i == 0) {
          return info.pc
        }

        const label = state.labels[labelName]
        assert(label && label.value != -1, `Impossible label ${labelName}`)
        return label.value
      }
    }

    resolvers.forEach(inst => {

      // separat pc if resolver changes pc
      let prePc = info.pc
      const result = inst.resolver(info)

      result.opcodes.forEach(opcode => {
        opcode.pc = prePc
        prePc++
        info.pc++
      })

      inst.result = result
    })

    newLabels = JSON.stringify(state.labels)
  } while (lastLabels != newLabels)

  // add opcodes to linear memory and convert all opcodes to executable
  resolvers.forEach(inst => {
    inst.result!.opcodes.forEach(opcode => {
      assert(typeof opcode.opcode == 'number', 'False opcodes')
      assert(typeof opcode.pc == 'number', 'False opcodes')

      assert(!state.executable[opcode.pc], 'Invalid pc')
      state.executable[opcode.pc] = opcode
      opcode.inst = inst.result!
    })
  })

  state.program.result = resolvers.map(r => r.result!)
}

////////////////////////////////////////////////////////////////////////////////
/*                         --- compile and print ---                          */
////////////////////////////////////////////////////////////////////////////////

function printProgram(state: State) {

  type SourceFiles = {
    [key: string]: {
      lines: string[],
      sourceLineNumber: number
    }
  }

  const sourceFiles: SourceFiles = {
    '_base': {
      lines: [],
      sourceLineNumber: 1
    }
  }

  Object.keys(sources).forEach(fileName => {
    const lines = sources[fileName]!.split('\n').map((line, i) => {
      return `${fileName}:${`${i + 1}:`.padEnd(4)} ${line}`
    })

    sourceFiles[fileName] = {
      lines,
      sourceLineNumber: 1,
    }
  })

  const outSource: string[] = []
  const outProgram: string[] = []
  const outOpcode: string[] = []

  state.program.result.forEach(programLine => {
    assert(programLine.span && typeof programLine.print == 'string', 'Invalid line: ' + programLine.print)

    const programLineFile = programLine.span.fileName
    const programLineNumber = programLine.span.line
    const sourceFile = sourceFiles[programLineFile]

    if (!sourceFile) console.log(sourceFile, programLineFile);

    assert(!isNaN(programLineNumber), 'Invalid line!')

    // if source is begind
    while (sourceFile.sourceLineNumber < programLineNumber) {
      outProgram.push('')
      outOpcode.push('')
      outSource.push(sourceFile.lines[sourceFile.sourceLineNumber - 1])
      sourceFile.sourceLineNumber++
    }

    outProgram.push(programLine.print)

    if (programLine.opcodes.length) {
      const opcode = programLine.opcodes[0]

      state.printable.addresses[opcode.pc!] = outOpcode.length
      outOpcode.push(`${hex(opcode.pc!, 4, false)}: ${opcode.print}`)

      for (let i = 1; i < programLine.opcodes.length; i++) {
        const opcode = programLine.opcodes[i]
        state.printable.addresses[opcode.pc!] = outOpcode.length
        outOpcode.push(`${hex(opcode.pc!, 4, false)}: ${opcode.print}`)
        outProgram.push('')
      }
    } else {
      outOpcode.push('')
    }

    // if new source is required
    if (programLineNumber >= sourceFile.sourceLineNumber) {
      outSource.push(sourceFile.lines[sourceFile.sourceLineNumber - 1])
      sourceFile.sourceLineNumber++
    }

    // if source is behind
    while (outSource.length < outOpcode.length) {
      outSource.push('')
    }

    // outSource.push('')
    // outProgram.push('')
    // outOpcode.push('')
  })

  // print the rest of file, but when does it end?
  // sourceLines.forEach(line => {
  //   outSource.push(line)
  //   outProgram.push('')
  //   outOpcode.push('')
  // })

  assert(outOpcode.length == outProgram.length && outOpcode.length == outSource.length, 'Invalid length')

  state.printable.lines = outProgram.map((prog, line) => {
    return `${outOpcode[line].padEnd(36)} | ${prog.padEnd(30)} | ${outSource[line]}`
  })

  document.getElementById('pre')!.innerHTML = printHeader + state.printable.lines.join('\n')
}

function compile(source: string, fileName: string): State | null {
  console.clear()
  Object.keys(sources).forEach(file => delete sources[file])

  try {

    // split the source code in tokes and save the span
    const tokens = tokenize(source, fileName)

    // create a state rappresenting the source code
    const state = build(tokens)

    assemble(state)

    printProgram(state)

    return state
  } catch (e: any) {
    console.log('ERROR:', e);
    document.getElementById('pre')!.innerHTML = e
  }

  return null
}

////////////////////////////////////////////////////////////////////////////////
/*                         --- simulate and display ----                      */
////////////////////////////////////////////////////////////////////////////////

const rMask = 0b00000_000000_11111
const gMask = 0b00000_111111_00000
const bMask = 0b11111_000000_00000

function getRGB(value: number) {
  const r = Math.floor(((value & rMask) >> 0 ) / 32 * 255)
  const g = Math.floor(((value & gMask) >> 5 ) / 64 * 255)
  const b = Math.floor(((value & bMask) >> 11) / 32 * 255)

  return `rgb(${r}, ${g}, ${b})`
}

const printHeader = 'ADDRESS OPCODE  TYPE   IMM  A  B  D  |\n-------------------------------------|\n'
function printState(simulation: Simulation) {
  const {addresses, lines} = simulation.program.printable
  const middle = addresses[simulation.pc]
  const emptyLine = '                                     |'

  let out = []

  for (let i = middle - 10; i < middle; i++) {
    if (i < 0) {
      out.push(emptyLine)
      continue
    }

    out.push(lines[i])
  }

  out.push('<span style="color:green">' + `${lines[middle]}` + '</span>')

  for (let i = middle + 1; i < middle + 11; i++) {
    if (i >= lines.length) {
      out.push(emptyLine)
      continue
    }

    out.push(lines[i])
  }

  out.push(`\n\n\nREGISTERS:`)
  registersIndex.forEach(register => {
    if (register == 'r0') {
      out.push(`0  = 0x0000`)
      return
    }

    const regContent = state.registers[register]

    if (regContent) {
      const value = hex(regContent.value, 4, false)
      const line = lines[addresses[regContent.inst.pc]].split('|')
      const printLine = line[line.length - 1]

      const {rName, rType} = regContent.inst
      const name = `${rType} ${rName}`.padEnd(26)

      out.push(`${register.padEnd(2)} = ${value} | ${name} | ${printLine}`)
      return
    }

    out.push(`${register.padEnd(2)} = 0x???? |`)
  })

  document.getElementById('pre').innerHTML = printHeader + out.join('\n')

  const printMemory = state.program.defines.__PRINT_MEMORY__?.value !== 0
  const printRam = state.program.defines.__PRINT_RAM__?.value !== 0

  let mem = `INST COUNT: ${state.instCount}\n\n\nRANDOM ACCESS MEMORY:\n`
  let lastIndex = 0
  state.memory.forEach((inst, i) => {
    if (!printMemory && i >= PRAM_BEGIN && i < MEMORY_MAPPED) return
    if (lastIndex < PRAM_BEGIN && i >= PRAM_BEGIN && i < TRAM_BEGIN) mem += '\nPIXEL VIDEO RAM:\n'
    if (lastIndex < TRAM_BEGIN && i >= TRAM_BEGIN && i < PROGRAM_ENTRY_POINT) mem += '\nTILE VIDEO RAM:\n'
    if (lastIndex < PROGRAM_ENTRY_POINT && i >= PROGRAM_ENTRY_POINT && i < MEMORY_MAPPED) mem += '\nEEPROM SOURCECODE:\n'
    if (lastIndex < MEMORY_MAPPED && i >= MEMORY_MAPPED) mem += '\nMEMORY_MAPPED:\n'

    const isPRAM = i >= PRAM_BEGIN && i < TRAM_BEGIN
    const equal = isPRAM ? '<span style="color:' + getRGB(inst.value) + ';">=</span>' : '='

    const from = lines[addresses[inst.inst.pc]] || 'Unknown source? Che magia as fait?'
    mem += `${hex(i, 4, false)} ${equal} ${hex(inst.value, 4, false)} | ${from}\n`

    lastIndex = i
  })

  if (printMemory || printRam) {
    document.getElementById('memory').innerHTML = mem
  }

  // render screen

  const {vga: {tileSet, TRAMModification, PRAMModification, context, tileContext}} = state
  const modifiedTiles = {}

  Object.keys(PRAMModification).forEach(originalIndex => {
    const index = originalIndex - PRAM_BEGIN
    const value = PRAMModification[originalIndex]

    const pixel = index % 64
    const tile = (index - pixel) / 64
    const ctx = state.vga.tileSet[tile].context
    const x = pixel % 8
    const y = (pixel - x) / 8

    ctx.fillStyle = getRGB(value);
    ctx.fillRect(x, y, 1, 1)

    modifiedTiles[tile] = true
    modifiedTiles[tile] = true
    delete PRAMModification[originalIndex]
  })

  function drawTileAt(context, value, index) {
    const x = index % 80
    const y = (index - x) / 80

    const canvas = state.vga.tileSet[value].canvas
    context.drawImage(canvas, x * 8, y * 8)
  }


  for (let i = 0; i < 4096; i++) {
    const value = state.memory[TRAM_BEGIN + i]?.value
    if (modifiedTiles[value]) {

      // draw on main screen
      drawTileAt(context, value, i)
    }
  }

  Object.keys(modifiedTiles).forEach(index => {
    const canvas = state.vga.tileSet[index].canvas

    const x = index % 64
    const y = (index - x) / 64

    tileContext.drawImage(canvas, x * 9 + 1, y * 9 + 1)

  })

  Object.keys(TRAMModification).forEach(originalIndex => {
    const index = originalIndex - TRAM_BEGIN
    const value = TRAMModification[originalIndex]

    // draw on main screen
    drawTileAt(context, value, index)

    delete TRAMModification[originalIndex]
  })
}

const MAX_INT = 1 << 16
function simulate(state: State) {
  assert(state, 'no state')

  const simulation: Simulation = state.simulation = {
    registers: {
      r0: { value: 0 },
      ra: { value: 0 },
      rb: { value: 0 },
      rc: { value: 0 },
      rd: { value: 0 },
      re: { value: 0 },
      rf: { value: 0 },
      sp: { value: 0 },
      pc: { value: 0 }
    },
    history: [[]],
    getRegister: (name: Register): Memory => {
      if (name == 'r0') return {value: 0}
      if (name == 'pc') return simulation.registers.pc

      assertInst(simulation.registers[name], `Invalid register access: '${name}'`)
      return simulation.registers[name]
    },
    setRegister: (name: Register, value: number): number => {
      value = (value + MAX_INT) % MAX_INT
      if (name == 'r0') return value
      if (name == 'pc') {
        simulation.registers.pc = {value}
        return value
      }

      simulation.registers[name] = {inst: currInst, value}
      return value
    },
    flags: {
      c: false,
      z: false,
      n: false
    },
    alu: (a, b, d, exec) => {
      const lhs = simulation.getRegister(a).value
      const rhs = simulation.getRegister(b).value
      const res = exec(lhs, rhs)



      const clipped = simulation.setRegister(d, res)
      simulation.flags = {
        n: (clipped & (1 << 15)) != 0,
        z: clipped == 0,
        c: res < 0 || res >= (1 << 16)
      }
    },
    readMemory: (index: number) => {
      const value = simulation.memory[index]
      assertInst(value, `Invalid memory read at '${index}'`)
      return value.value
    },
    writeMemory: (index: number, value: number) => {
      const under = index >= 0 && index < PROGRAM_ENTRY_POINT
      const above = index >= MEMORY_MAPPED && index < (1 << 16)

      assertInst(under || above, `Invalid memory write at '${index}' with ${value}`)

      value = (value + MAX_INT) % MAX_INT
      simulation.memory[index] = {
        value,
        inst: currInst
      }

      if (index >= MEMORY_MAPPED) {
        return value
      }

      if (index >= TRAM_BEGIN) {
        simulation.vga.TRAMModification[index] = value
        return
      }

      if (index >= PRAM_BEGIN) {
        simulation.vga.PRAMModification[index] = value
        return
      }

      return
    },
    pc: PROGRAM_ENTRY_POINT,
    memory: state.executable.map(el => ({value: el.opcode, inst: el, decoder: el.exec})),
    vga: {
      tileSet: [],
      TRAMModification: {},
      PRAMModification: {}
    },
    instCount: 0,
    printState
  }

  // vga standard 640 * 480
  simulation.vga.canvas = document.getElementById('screen')
  simulation.vga.context = simulation.vga.canvas.getContext('2d')
  simulation.vga.canvas.width = 80 * 8
  simulation.vga.canvas.height = 60 * 8

  const size = 64 * 8 + 65
  simulation.vga.tileCanvas = document.getElementById('tileMap')
  simulation.vga.tileContext = simulation.vga.tileCanvas.getContext('2d')
  simulation.vga.tileCanvas.width = size
  simulation.vga.tileCanvas.height = size

  const ctx = simulation.vga.tileContext
  ctx.fillStyle = '#0FF';
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = '#F0F';
  for (let i = 0; i < size; i += 9) {
    ctx.fillRect(i, 0, 1, size)
    ctx.fillRect(0, i, size, 1)
  }

  for (let i = 0; i < 4096; i++) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 8
    canvas.height = 8

    state.vga.tileSet.push({canvas, context})
  }

  let currInst = state.memory[state.pc].decoder
  assert(currInst, 'Invaldi entry point')

  function assertInst(condition, message) {
    if (!condition) {
      console.log(currInst)
      console.log(message);
      throw message
    }
  }

  function step(silent: boolean) {
    const nextInst = simulation.memory[simulation.registers.pc.value]
    const error = `Next inst not executable at '${simulation.registers.pc.value}'\nLast inst:${currInst.inst.print}`
    assertInst(nextInst && nextInst.decoder, error)
    currInst = nextInst.decoder

    const {inst: {print}, exec} = nextInst.decoder

    if (!silent) {
      console.log(`Executing: ${print}`)
    }

    assertInst(exec, 'No exec')

    simulation.instCount++
    simulation.pc++
    exec(simulation)
  }

  program.stepSimulation = (count, silent) => {
    for (let i = 0; i < count; i++) {
      try {
        step(silent)
      } catch (e1: any) {
        console.log(e1);

        try {
          assertSpan(currInst.inst.span, false, e1)
        } catch(e2: any) {
          state.program.stepSimulation = null
          document.getElementById('pre')!.innerHTML = e2
        }

        return
      }
    }

    printState(state)
  }

  program.interrupt = () => {
    if (state.memory[MM_INT_EN]?.value) {
      const vector = state.memory[MM_INT_VEC]?.value
      assertInst(vector, 'Interrupt vector table not available')
      state.pc = vector
    }
  }

  printState(state)
}

////////////////////////////////////////////////////////////////////////////////
/*                         --- input / output ----                            */
////////////////////////////////////////////////////////////////////////////////


window.addEventListener('load', () => {

  let compiling = false
  const sourceElement = document.getElementById('source')! as HTMLTextAreaElement
  const compileButton = document.getElementById('compile')! as HTMLButtonElement
  const runButton = document.getElementById('run')!
  const continuousButton = document.getElementById('continuous')!
  const focusButton = document.getElementById('focus')!
  const pre = document.getElementById('pre')!
  const memory = document.getElementById('memory')!
  const tileMap = document.getElementById('tileMap')!
  const screen = document.getElementById('screen')!


  let state: State | null = null

  let continuous = false
  let focus = false

  compileButton.onclick = () => {
    compiling = !compiling
    memory.style.display = 'none'
    tileMap.style.display = 'none'
    screen.style.display = 'none'

    if (compiling) {
      state = compile(sourceElement.value, 'main.f')
      compileButton.innerHTML = 'Edit!'
      sourceElement.style.display = 'none'
      pre.style.display = 'block'
      return
    }

    state = null
    continuous = false
    focus = false
    continuousButton.innerHTML = 'Stop!'
    focusButton.innerHTML = 'Focus!'
    compileButton.innerHTML = 'Compile!'
    sourceElement.style.display = 'block'
    pre.style.display = 'none'
  }

  runButton.onclick = () => {
    if (!state) compileButton.onclick()

    // if failed to compile
    if (state) {
      memory.style.display = 'block'
      screen.style.display = 'block'
      tileMap.style.display = 'block'
      simulate(state)
      return
    }

    console.log('Compilation failed')
  }

  continuousButton.onclick = () => {
    if (!state) runButton.onclick()

    // if failed to compile
    if (state) {
      continuous = !continuous
      continuousButton.innerHTML = continuous ? 'Stop!' : 'Start'
    }
  }

  focusButton.onclick = () => {
    if (!state) runButton.onclick()

    // if failed to compile
    if (state) {
      focus = !focus
      focusButton.innerHTML = focus ? 'Exit!' : 'Focus!'
    }
  }


  window.setInterval(() => {
    if (state && state.simulation && continuous) {
      state.simulation.interrupt()
      state.simulation.stepSimulation(1000, true)
    }
  }, 1000/60)

  window.addEventListener('keydown', e => {
    // console.log(e)

    if (state && state.simulation) {
      const simulation = state.simulation

      if (focus) {
        if (e.key.length == 1) {
          let code = e.key.charCodeAt(0)

          if (code >= 0 && code < 128) {
            simulation.writeMemory(MEMORY_MAPPED, code)
            simulation.stepSimulation(0)
          }
        }

        const map = {
          'ArrowLeft': 2,
          'ArrowUp': 3,
          'ArrowRight': 4,
          'ArrowDown': 5,
          'Backspace': 8,
          'Enter': 10,
        } as const

        if (map[e.key]) {
          simulation.writeMemory(MM_KEYBOARD, map[e.key])
          simulation.stepSimulation(0)
        }

        if (!e.ctrlKey) {
          e.preventDefault()
        }

        return
      }

      if (e.key == 'n') {
        simulation.stepSimulation(1)
      }

      if (e.key == 'm') {
        simulation.stepSimulation(10000, true)
      }

      if (e.key == ',') {
        simulation.stepSimulation(100000, true)
      }

      if (e.key == 'c') {
        compileButton.onclick()
        compileButton.onclick()
      }

      if (e.key == 'ArrowUp') {
        if (simulation.memory[simulation.pc - 1]) {
          simulation.pc--
          simulation.stepSimulation(0)
        }
        e.preventDefault()
      }

      if (e.key == 'ArrowDown') {
        if (simulation.memory[simulation.pc + 1]) {
          simulation.pc++
          simulation.stepSimulation(0)
        }
        e.preventDefault()
      }
    }

    if (compiling) {
      if (e.key == 'r') {
        runButton.onclick()
      }

      if (e.key == 'e') {
        compileButton.onclick()
      }
    }
  })

  runButton.onclick()
  if (state) {
    // state.stepSimulation(100000, true)
    // continuousButton.onclick()
    // focusButton.onclick()
    // window.scrollTo(0, 0)
  }

  window.setTimeout(() => {
    window.scrollTo(0, 0)
  }, 50)
})