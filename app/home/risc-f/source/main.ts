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
  fileName: '_base',
  line: 0,
  colum: 0,
  print: '_base:0:0'
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

type BaseOperand = {type: string, dataType: Type, span: Span }

type LabelName = string & { __brand: 'labelName' }
type Label = BaseOperand & { type: 'label', value: number, name: LabelName }

type BaseVariable = BaseOperand & { name: string, span: Span }
type StackVariable = BaseVariable & { type: 'stack', offset: number, info: {defined: boolean} }
type GlobalVariable = BaseVariable & { type: 'global', offset: number, info: {defined: boolean}, expr?: Operand }
type RegisterVariable = BaseVariable & { type: 'register', name: string, id: RegisterID }
type FunctionVariable = BaseVariable & { type: 'functionVariable', name: string, function: FunctionContext}

type VariableOperand = StackVariable | GlobalVariable | RegisterVariable | FunctionVariable
type NumberOperand = BaseOperand & { type: 'number', value: number}
type DerefOperand = BaseOperand & { type: 'deref', of: RegisterVariable, offset: number }
type ArrayOperand = BaseOperand & { type: 'array', array: Operand[] }
type StringOperand = BaseOperand & { type: 'string', string: string }
type BinaryOperand = BaseOperand & { type: 'binary', lhs: Operand, rhs: Operand, operator: BaseBinaryType }
type UnaryOperand = BaseOperand & { type: 'unary', lhs: Operand, rhs: Operand, operator: UnaryOperator }
type ConditionalOperand = BaseOperand & { type: 'conditional', lhs: Operand, rhs: Operand, operator: ConditionalOperator }
type CallOperand = BaseOperand & { type: 'functionCall', function: FunctionContext }

type Operand =  VariableOperand | NumberOperand | DerefOperand | ArrayOperand | StringOperand | BinaryOperand | CallOperand | Label | UnaryOperand | ConditionalOperand


// Function

type ContextVariable = {
  breakID?: LabelName,
  continueID?: LabelName,
  return?: {
    type: Type,
    label: LabelName
  }
}

type FunctionContext = {
  args: RegisterVariable[],
  name: string,
  dataType: Type,
  beginLabel: LabelName,
  returnAddress: RegisterVariable,
  returnRegister?: AvailableRegs,
  context: Context,
  span: Span,
  usedRegisters: AvailableRegs[]
}

// Lexer, State, Context

type Lexer = {
  next: (...types: Token["type"][]) => Token,
  peek: (index?: number) => Token,
  nextIs: (...values: string[]) => Token,
  unNext: (data: string, fileName: string) => void,
  hasNext: () => number
}

type Memory = {
  value: number,
  inst?: Opcode,
  decoder?: ExecOpcode
}

type Simulation = {
  alu: (a: Register, b: Register, d: Register, exec: (a: number, b:number) => number) => void
  readMemory: (index: number) => number
  writeMemory: (index: number, value: number, rewind?: boolean) => void
  getRegister: (name: Register) => Memory
  setRegister: (name: Register, value: number) => number
  currInst: Opcode,
  history: ((silent: boolean) => void)[][],
  state: State,
  flags: {
    n: boolean,
    z: boolean,
    c: boolean
  },
  interrupt: () => void
  stepSimulation: null | ((count: number, print?: boolean) => void),
  memory: (Memory | undefined)[]
  registers: {
    [key in Register]: Memory
  }
  vga: {
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    tileCanvas: HTMLCanvasElement,
    tileContext: CanvasRenderingContext2D,
    tileSet: {
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D
    }[],
    TRAMModification: {[key: number]: number},
    PRAMModification: {[key: number]: number}
  },
  instCounter: number
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

// Used only as getInfo
type RegisterID = string & { __brand: 'regisreID' }
type RegisterInfo = { register: AvailableRegs, name: string, type: Type, span: Span }

const r0ID = 'r0' as RegisterID
const spID = 'sp' as RegisterID
const raID = 'ra' as RegisterID

type Info = {
  getReg: (reg: RegisterID) => RegisterInfo,
  getUsedRegisters: () => AvailableRegs[],
  solveLabel: (label: LabelName) => number,
  pc: number
}

const types_f = `typedef word int_t

typedef int_t char_t
typedef int_t pixel_t
typedef int_t tile_t
typedef int_t bool_t
typedef int_t inst_t
typedef inst_t* addr_t

define bool_t true = 1
define bool_t false = 0` as const

const charset = [
  [0x00, 0x00, 0x00, 0x18, 0x18, 0x00, 0x00, 0x00],   // U+0000 (nul)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0001 (cursor)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0002 (leftArrow)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0003 (upArrow)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0004 (rightArrow)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0005 (downArrow)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0006
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0007
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0008 (delete)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0009
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+000A (\n)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+000B
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+000C
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+000D
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+000E
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+000F
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0010
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0011
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0012
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0013
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0014
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0015
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0016
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0017
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0018
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0019
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+001A
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+001B
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+001C
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+001D
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+001E
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+001F
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0020 (space)
  [0x18, 0x3C, 0x3C, 0x18, 0x18, 0x00, 0x18, 0x00],   // U+0021 (!)
  [0x36, 0x36, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0022 (")
  [0x36, 0x36, 0x7F, 0x36, 0x7F, 0x36, 0x36, 0x00],   // U+0023 (#)
  [0x0C, 0x3E, 0x03, 0x1E, 0x30, 0x1F, 0x0C, 0x00],   // U+0024 ($)
  [0x00, 0x63, 0x33, 0x18, 0x0C, 0x66, 0x63, 0x00],   // U+0025 (%)
  [0x1C, 0x36, 0x1C, 0x6E, 0x3B, 0x33, 0x6E, 0x00],   // U+0026 (&)
  [0x06, 0x06, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0027 (')
  [0x18, 0x0C, 0x06, 0x06, 0x06, 0x0C, 0x18, 0x00],   // U+0028 (()
  [0x06, 0x0C, 0x18, 0x18, 0x18, 0x0C, 0x06, 0x00],   // U+0029 ())
  [0x00, 0x66, 0x3C, 0xFF, 0x3C, 0x66, 0x00, 0x00],   // U+002A (*)
  [0x00, 0x0C, 0x0C, 0x3F, 0x0C, 0x0C, 0x00, 0x00],   // U+002B (+)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x0C, 0x0C, 0x06],   // U+002C (,)
  [0x00, 0x00, 0x00, 0x3F, 0x00, 0x00, 0x00, 0x00],   // U+002D (-)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x0C, 0x0C, 0x00],   // U+002E (.)
  [0x60, 0x30, 0x18, 0x0C, 0x06, 0x03, 0x01, 0x00],   // U+002F (/)
  [0x3E, 0x63, 0x73, 0x7B, 0x6F, 0x67, 0x3E, 0x00],   // U+0030 (0)
  [0x0C, 0x0E, 0x0C, 0x0C, 0x0C, 0x0C, 0x3F, 0x00],   // U+0031 (1)
  [0x1E, 0x33, 0x30, 0x1C, 0x06, 0x33, 0x3F, 0x00],   // U+0032 (2)
  [0x1E, 0x33, 0x30, 0x1C, 0x30, 0x33, 0x1E, 0x00],   // U+0033 (3)
  [0x38, 0x3C, 0x36, 0x33, 0x7F, 0x30, 0x78, 0x00],   // U+0034 (4)
  [0x3F, 0x03, 0x1F, 0x30, 0x30, 0x33, 0x1E, 0x00],   // U+0035 (5)
  [0x1C, 0x06, 0x03, 0x1F, 0x33, 0x33, 0x1E, 0x00],   // U+0036 (6)
  [0x3F, 0x33, 0x30, 0x18, 0x0C, 0x0C, 0x0C, 0x00],   // U+0037 (7)
  [0x1E, 0x33, 0x33, 0x1E, 0x33, 0x33, 0x1E, 0x00],   // U+0038 (8)
  [0x1E, 0x33, 0x33, 0x3E, 0x30, 0x18, 0x0E, 0x00],   // U+0039 (9)
  [0x00, 0x0C, 0x0C, 0x00, 0x00, 0x0C, 0x0C, 0x00],   // U+003A (:)
  [0x00, 0x0C, 0x0C, 0x00, 0x00, 0x0C, 0x0C, 0x06],   // U+003B (;)
  [0x18, 0x0C, 0x06, 0x03, 0x06, 0x0C, 0x18, 0x00],   // U+003C (<)
  [0x00, 0x00, 0x3F, 0x00, 0x00, 0x3F, 0x00, 0x00],   // U+003D (=)
  [0x06, 0x0C, 0x18, 0x30, 0x18, 0x0C, 0x06, 0x00],   // U+003E (>)
  [0x1E, 0x33, 0x30, 0x18, 0x0C, 0x00, 0x0C, 0x00],   // U+003F (?)
  [0x3E, 0x63, 0x7B, 0x7B, 0x7B, 0x03, 0x1E, 0x00],   // U+0040 (@)
  [0x0C, 0x1E, 0x33, 0x33, 0x3F, 0x33, 0x33, 0x00],   // U+0041 (A)
  [0x3F, 0x66, 0x66, 0x3E, 0x66, 0x66, 0x3F, 0x00],   // U+0042 (B)
  [0x3C, 0x66, 0x03, 0x03, 0x03, 0x66, 0x3C, 0x00],   // U+0043 (C)
  [0x1F, 0x36, 0x66, 0x66, 0x66, 0x36, 0x1F, 0x00],   // U+0044 (D)
  [0x7F, 0x46, 0x16, 0x1E, 0x16, 0x46, 0x7F, 0x00],   // U+0045 (E)
  [0x7F, 0x46, 0x16, 0x1E, 0x16, 0x06, 0x0F, 0x00],   // U+0046 (F)
  [0x3C, 0x66, 0x03, 0x03, 0x73, 0x66, 0x7C, 0x00],   // U+0047 (G)
  [0x33, 0x33, 0x33, 0x3F, 0x33, 0x33, 0x33, 0x00],   // U+0048 (H)
  [0x1E, 0x0C, 0x0C, 0x0C, 0x0C, 0x0C, 0x1E, 0x00],   // U+0049 (I)
  [0x78, 0x30, 0x30, 0x30, 0x33, 0x33, 0x1E, 0x00],   // U+004A (J)
  [0x67, 0x66, 0x36, 0x1E, 0x36, 0x66, 0x67, 0x00],   // U+004B (K)
  [0x0F, 0x06, 0x06, 0x06, 0x46, 0x66, 0x7F, 0x00],   // U+004C (L)
  [0x63, 0x77, 0x7F, 0x7F, 0x6B, 0x63, 0x63, 0x00],   // U+004D (M)
  [0x63, 0x67, 0x6F, 0x7B, 0x73, 0x63, 0x63, 0x00],   // U+004E (N)
  [0x1C, 0x36, 0x63, 0x63, 0x63, 0x36, 0x1C, 0x00],   // U+004F (O)
  [0x3F, 0x66, 0x66, 0x3E, 0x06, 0x06, 0x0F, 0x00],   // U+0050 (P)
  [0x1E, 0x33, 0x33, 0x33, 0x3B, 0x1E, 0x38, 0x00],   // U+0051 (Q)
  [0x3F, 0x66, 0x66, 0x3E, 0x36, 0x66, 0x67, 0x00],   // U+0052 (R)
  [0x1E, 0x33, 0x07, 0x0E, 0x38, 0x33, 0x1E, 0x00],   // U+0053 (S)
  [0x3F, 0x2D, 0x0C, 0x0C, 0x0C, 0x0C, 0x1E, 0x00],   // U+0054 (T)
  [0x33, 0x33, 0x33, 0x33, 0x33, 0x33, 0x3F, 0x00],   // U+0055 (U)
  [0x33, 0x33, 0x33, 0x33, 0x33, 0x1E, 0x0C, 0x00],   // U+0056 (V)
  [0x63, 0x63, 0x63, 0x6B, 0x7F, 0x77, 0x63, 0x00],   // U+0057 (W)
  [0x63, 0x63, 0x36, 0x1C, 0x1C, 0x36, 0x63, 0x00],   // U+0058 (X)
  [0x33, 0x33, 0x33, 0x1E, 0x0C, 0x0C, 0x1E, 0x00],   // U+0059 (Y)
  [0x7F, 0x63, 0x31, 0x18, 0x4C, 0x66, 0x7F, 0x00],   // U+005A (Z)
  [0x1E, 0x06, 0x06, 0x06, 0x06, 0x06, 0x1E, 0x00],   // U+005B ([)
  [0x03, 0x06, 0x0C, 0x18, 0x30, 0x60, 0x40, 0x00],   // U+005C (\)
  [0x1E, 0x18, 0x18, 0x18, 0x18, 0x18, 0x1E, 0x00],   // U+005D (])
  [0x08, 0x1C, 0x36, 0x63, 0x00, 0x00, 0x00, 0x00],   // U+005E (^)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF],   // U+005F (_)
  [0x0C, 0x0C, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+0060 (`)
  [0x00, 0x00, 0x1E, 0x30, 0x3E, 0x33, 0x6E, 0x00],   // U+0061 (a)
  [0x07, 0x06, 0x06, 0x3E, 0x66, 0x66, 0x3B, 0x00],   // U+0062 (b)
  [0x00, 0x00, 0x1E, 0x33, 0x03, 0x33, 0x1E, 0x00],   // U+0063 (c)
  [0x38, 0x30, 0x30, 0x3e, 0x33, 0x33, 0x6E, 0x00],   // U+0064 (d)
  [0x00, 0x00, 0x1E, 0x33, 0x3f, 0x03, 0x1E, 0x00],   // U+0065 (e)
  [0x1C, 0x36, 0x06, 0x0f, 0x06, 0x06, 0x0F, 0x00],   // U+0066 (f)
  [0x00, 0x00, 0x6E, 0x33, 0x33, 0x3E, 0x30, 0x1F],   // U+0067 (g)
  [0x07, 0x06, 0x36, 0x6E, 0x66, 0x66, 0x67, 0x00],   // U+0068 (h)
  [0x0C, 0x00, 0x0E, 0x0C, 0x0C, 0x0C, 0x1E, 0x00],   // U+0069 (i)
  [0x30, 0x00, 0x30, 0x30, 0x30, 0x33, 0x33, 0x1E],   // U+006A (j)
  [0x07, 0x06, 0x66, 0x36, 0x1E, 0x36, 0x67, 0x00],   // U+006B (k)
  [0x0E, 0x0C, 0x0C, 0x0C, 0x0C, 0x0C, 0x1E, 0x00],   // U+006C (l)
  [0x00, 0x00, 0x33, 0x7F, 0x7F, 0x6B, 0x63, 0x00],   // U+006D (m)
  [0x00, 0x00, 0x1F, 0x33, 0x33, 0x33, 0x33, 0x00],   // U+006E (n)
  [0x00, 0x00, 0x1E, 0x33, 0x33, 0x33, 0x1E, 0x00],   // U+006F (o)
  [0x00, 0x00, 0x3B, 0x66, 0x66, 0x3E, 0x06, 0x0F],   // U+0070 (p)
  [0x00, 0x00, 0x6E, 0x33, 0x33, 0x3E, 0x30, 0x78],   // U+0071 (q)
  [0x00, 0x00, 0x3B, 0x6E, 0x66, 0x06, 0x0F, 0x00],   // U+0072 (r)
  [0x00, 0x00, 0x3E, 0x03, 0x1E, 0x30, 0x1F, 0x00],   // U+0073 (s)
  [0x08, 0x0C, 0x3E, 0x0C, 0x0C, 0x2C, 0x18, 0x00],   // U+0074 (t)
  [0x00, 0x00, 0x33, 0x33, 0x33, 0x33, 0x6E, 0x00],   // U+0075 (u)
  [0x00, 0x00, 0x33, 0x33, 0x33, 0x1E, 0x0C, 0x00],   // U+0076 (v)
  [0x00, 0x00, 0x63, 0x6B, 0x7F, 0x7F, 0x36, 0x00],   // U+0077 (w)
  [0x00, 0x00, 0x63, 0x36, 0x1C, 0x36, 0x63, 0x00],   // U+0078 (x)
  [0x00, 0x00, 0x33, 0x33, 0x33, 0x3E, 0x30, 0x1F],   // U+0079 (y)
  [0x00, 0x00, 0x3F, 0x19, 0x0C, 0x26, 0x3F, 0x00],   // U+007A (z)
  [0x38, 0x0C, 0x0C, 0x07, 0x0C, 0x0C, 0x38, 0x00],   // U+007B ([)
  [0x18, 0x18, 0x18, 0x00, 0x18, 0x18, 0x18, 0x00],   // U+007C (|)
  [0x07, 0x0C, 0x0C, 0x38, 0x0C, 0x0C, 0x07, 0x00],   // U+007D (])
  [0x6E, 0x3B, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],   // U+007E (~)
  [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]    // U+007F
]

function addChar(index: number, glyph: string) {
  const lines = glyph.trim().split('\n')
  if (lines.length > 8) console.error('to tall')

  const out: number[] = []
  lines.forEach(line => {
    let num = 0
    if (line.length > 8) console.error('to wide')
    line.split('').forEach((e, i) => num += (e == '#' ? (1 << i) : 0))
    out.push(num)
  })

  charset[index] = out
}

addChar(1, `
.
#
#
#
#
#
#
.
`)


const out: number[] = []
charset.forEach(char => {
  assert(char.length == 8, 'Invalid char')
  for (let i = 0; i < 8; i += 2) {
    const num = char[i]! + (char[i + 1]! << 8) ||0
    out.push(num)
  }
})

const charset_f = `
const char_t* charset = [${out.join(', ')}]

define char_t NULL_CHAR        = 0
define char_t CURSOR_CHAR      = 1
define char_t LEFT_ARROW_CHAR  = 2
define char_t UP_ARROW_CHAR    = 3
define char_t RIGHT_ARROW_CHAR = 4
define char_t DOWN_ARROW_CHAR  = 5
define char_t DEL_CHAR         = 8
define char_t NEWLINE_CHAR     = 10

define int_t COL_SIZE = 80
define int_t ROW_SIZE = 60`

const PRAM_BEGIN = 0b1000_0000_0000_0000
const TRAM_BEGIN = 0b1010_0000_0000_0000
const PROGRAM_ENTRY_POINT = 0b1100_0000_0000_0000
const MEMORY_MAPPED = 0b1111_1111_1111_0000

const MM_KEYBOARD = 0b1111_1111_1111_0000
const MM_INT_VEC = 0b1111_1111_1111_0001
const MM_INT_EN = 0b1111_1111_1111_0010

const memoryMapped_f = `
define char_t* MM_KEYBOARD = ${MM_KEYBOARD}
define int_t* MM_INT_VEC = ${MM_INT_VEC}
define int_t* MM_INT_EN = ${MM_INT_EN}

define pixel_t* PRAM_BEGIN   = ${PRAM_BEGIN}
define tile_t* TRAM_BEGIN    = ${TRAM_BEGIN}
define int_t* PROGRAM_ENTRY_POINT = ${PROGRAM_ENTRY_POINT}
define int_t* MEMORY_MAPPED = ${MEMORY_MAPPED}
`

// Assertions

const baseSources = {
  "types.f": types_f,
  "charset.f": charset_f,
  "memoryMapped.f": memoryMapped_f
}

let sources: {[key: string]: string | undefined} = baseSources

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

    assert(condition, `${cause}\n\n\nError at line: ${span.print}\n  ${message}`)
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
      return `dereferce which results in '${expr.dataType.print}'`

    case 'array':
    case 'string':
      return `'${expr.type}' '${expr.dataType.print}'`

    case 'functionVariable':
      return `funcion operand '${expr.name}' which has the type '${expr.dataType.print}'`
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
      while (lexer.peek() && lexer.peek()!.match(/[0-9a-zA-Z_]/)) {
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
      while (lexer.peek() && lexer.peek()!.match(/[a-zA-Z0-9_]/)) {
        token += lexer.next()
      }

      if (registers.includes(token as Register)) {
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
      const closing = token

      token = ''
      while (lexer.peek() != closing) {
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
    // assertUnreachable(`Unknown token: ${char}, at:
  }

  tokens.push({
    token: fileName,
    span: lexer.getCurrentSpan(),
    type: 'fileEnd'
  })

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
    const token = tokens[index]
    assert(token, 'Unexpected end of input')
    return token
  }

  function unNext(data: string, fileName: string) {
    const newTokens = tokenize(data, fileName)
    tokens = newTokens.concat(...tokens)
  }

  function hasNext() {
    return tokens.length
  }

  return {next, peek, nextIs, unNext, hasNext}
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
        assertTypes(arg, fun.args[currArg]!)

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

function buildFunction(lexer: Lexer, state: State, context: Context, returnType: Type) {
  // parsing already started in parseDeclaration

  lexer.nextIs('function')
  const funName = lexer.next('string')
  context.unresolve(funName.span, funName.token)
  lexer.nextIs('(')

  const isMain = funName.token == 'main'
  // ID for entry and return statements
  const ID = nextInt()
  const entryID = (isMain ? '__MAIN__' : `_fun_entry_${ID}`) as LabelName
  const exitID = `_fun_exit_${ID}` as LabelName

  solveLabel(state, context, returnType.span, entryID)

  const fork = context.fork(funName.span)
  const bodyContext = fork.split(funName.span, {
    return: {
      label: exitID,
      type: returnType
    }
  })

  // save the arguments required, signature
  const args: RegisterVariable[] = []

  while (lexer.peek().token != ')') {
    const type = buildType(lexer, state, context)
    const argName = lexer.next('string')

    context.unresolve(argName.span, argName.token)

    const register = bodyContext.addRegister(argName.span, argName.token, type)

    args.push(register)

    if (lexer.peek().token != ',') break
    lexer.nextIs(',')
  }

  const fromStart = lexer.nextIs(')')

  // reserve __retAddr, if it's main it will never be used
  let returnAddress: RegisterVariable
  console.log(funName.token)
  if (!isMain) {
    returnAddress = bodyContext.addRegister(fromStart.span, '__retAddr', addrType)
  }

  // consumes { }
  const body = parseBlock(lexer, state, bodyContext)
  assertSpan(body.end, body.didReturn, 'Function never returned')

  // stack deallocation must happen even if there is a return
  if (bodyContext.stack.size) {

    const pre = state.program.instructions.pop()!
    solveLabel(state, context, returnType.span, exitID, returnType)
    state.program.instructions.push(pre)

  } else {
    solveLabel(state, context, returnType.span, exitID, returnType)
  }

  fork.join(bodyContext.end)

  if (!isMain) {
    solveJALR(state, bodyContext, bodyContext.end, returnAddress!.id, r0ID)
    bodyContext.resolve(bodyContext.end, '__retAddr')
  }

  state.functions[funName.token] = {
    type: 'functionVariable',
    span: funName.span,
    dataType: returnType,
    name: funName.token,
    function: {
      args,
      dataType: returnType,
      name: funName.token,
      beginLabel: entryID,
      context: bodyContext,
      span: funName.span,
      returnAddress: returnAddress!,
      usedRegisters: []
    }
  }

  return true
}

// return
function parseReturn(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == 'return') {
    const start = lexer.nextIs('return')

    const info = context.contextVariable.return
    assertSpan(start.span, info, 'Cannot return in non function')

    context.didReturn = true

    if (info.type.type != 'void') {
      const returnReg = context.addRegister(start.span, '__return', info.type)

      const expr = buildExpression(lexer, state, context)
      solveExpression(state, context, returnReg, expr)
	    return true
    }
    // else is void type

    if (lexer.peek().token != '}') assertUnexpected(lexer.next())

    return true
  }

  return false
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
    const register = context.addRegister(name.span, name.token, type)

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
    lexer.next()

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
    lexer.next()

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
      name: type.name.replace(type.name, name.token),
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

    lexer.nextIs('=')
    const expr = buildExpression(lexer, state, context)

    solveExpression(state, context, to, expr)

    return true
  }

  return false
}

function parseVoidFunCall(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().type == 'string' && lexer.peek(1).token == '(') {
    const fun = buildOperand(lexer, state, context)

    assertSpan(fun.span, fun.type == 'functionCall', `Cannot call non function ${fun.type}`)
    assertSpan(fun.span, fun.dataType.type == 'void', `Function doesn't return void, '${fun.dataType.print}'`)

    solveFunctionCall(state, context, fun)
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
    // const start = lexer.nextIs('?')
    // let ret = 'Register interrogation:\n\n'

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
  const aReg = registers.indexOf(a)
  const bReg = registers.indexOf(b)
  const dReg = registers.indexOf(d)
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
        print: `${hex(opcode, 4, false)}: I ADI ${hex(imm, 2)}    ${bReg.register} ${dReg.register}`
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

    const opcodes: Opcode[] = []

    if (upper) {
      solveLUI(state, context, to, upper)
      const lui = state.program.instructions.pop()!(info)
      opcodes.push(...lui.opcodes)
    }

    if (lower || !upper) {
      const from = upper ? to : r0ID
      solveADI(state, context, to, from, lower)
      const adi = state.program.instructions.pop()!(info)
      opcodes.push(...adi.opcodes)
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
      solveFunctionCall(state, context, expr, to)

      return
    }

    if (expr.type == 'functionVariable') {
      solveLDI_LABEL(state, context, to.id, expr.function.beginLabel)

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
  console.log(to, expr)
  assertSpan(to.span, false, `Cannot assign ${lhs} to ${rhs}`)
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
        exec: s => s.alu('r0', 'pc', d, (a, pc) => {
          s.registers.pc.value = imm
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
    const bReg = info.getReg(to)
    const dReg = info.getReg(link)

    const b = bReg.register
    const d = dReg.register

    let opcode = solveRegisters('r0', b, d)
    // const immCode = solveImmediate(imm, 9)

    return {
      span,
      print: `jalr ${b}, ${d}`,
      opcodes: [{
        opcode,
        exec: s => s.alu('r0', b, d, (a, dest) => {
          const ret = s.registers.pc.value
          s.registers.pc.value = dest
          return ret
        }),
        rName: dReg.name,
        rType: dReg.type.print,
        print: `${hex(opcode, 4, false)}: J JALR        ${b} ${d}`
      }]
    }
  })
}

function solveFunctionCall(state: State, context: Context, fun: CallOperand, to?: RegisterVariable) {
  state.program.push(info => {
    const opcodes: Opcode[] = []

    const callerUsed = info.getUsedRegisters()
    debugger
    const calleeUsed = fun.function.usedRegisters

    const used = calleeUsed.filter(el => callerUsed.includes(el))

    console.log(fun.function.name, callerUsed, calleeUsed, used)

    if (used.length) {
      solveADI(state, context, spID, spID, -callerUsed.length)
      const adi = state.program.instructions.pop()!(info)
      opcodes.push(...adi.opcodes)

      used.forEach((reg, i) => {
        solveSTO(state, context, spID, reg as RegisterID, i)
        const sto = state.program.instructions.pop()!(info)
        opcodes.push(...sto.opcodes)
      })
    }

    solveJAL(state, context, fun.span, fun.function.beginLabel, fun.function.returnAddress.id)
    const jal = state.program.instructions.pop()!(info)
    opcodes.push(...jal.opcodes)

    if (to) {
      assertSpan(fun.span, fun.function.returnRegister, 'Impossible')
      solveADI(state, context, to.id, fun.function.returnRegister as RegisterID, 0)
      const adi = state.program.instructions.pop()!(info)
      opcodes.push(...adi.opcodes)
    }

    if (used.length) {
      used.forEach((reg, i) => {
        solveLOD(state, context, reg as RegisterID, spID, i)
        const lod = state.program.instructions.pop()!(info)
        opcodes.push(...lod.opcodes)
      })

      solveADI(state, context, spID, spID, +callerUsed.length)
      const adi = state.program.instructions.pop()!(info)
      opcodes.push(...adi.opcodes)
    }

    return {
      span: fun.span,
      print: `CAL ${fun.function.name}`,
      opcodes
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

    // Convert string of length one to char as number
    if (lhs.type == 'string' && lhs.string.length == 1) {
      lhs = {
        type: 'number',
        value: lhs.string.charCodeAt(0),
        span: lhs.span,
        dataType: lhs.dataType
      }
    }

    if (rhs.type == 'string' && rhs.string.length == 1) {
      rhs = {
        type: 'number',
        value: rhs.string.charCodeAt(0),
        span: rhs.span,
        dataType: rhs.dataType
      }
    }

    assert(lhs.type != 'number' || rhs.type != 'number', 'Not implemented')
    assertSpan(lhs.span, lhs.type == 'register' || lhs.type == 'number', `expected 'number | register' but got ${lhs.type}`)
    assertSpan(rhs.span, rhs.type == 'register' || rhs.type == 'number', `expected 'number | register' but got ${rhs.type}`)

    const type = branchName[operator]

    solveCMP(state, context, condition.span, lhs, type, rhs, ifTrue)

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
  const start = lexer.peek()
  if (start.token == '{')  {

    const fork = context.fork(start.span)
    const block = parseBlock(lexer, state, fork.split(start.span, {}))
    fork.join(block.end)

    return true
  }

  return false
}

function parseIf(lexer: Lexer, state: State, context: Context): boolean {
  if (lexer.peek().token == 'if') {

    lexer.nextIs('if')

    const id = nextInt()
    const elseID = `_if_else_${id}` as LabelName
    const endID = `_if_end_${id}` as LabelName

    const preProgram = state.program.take()

    lexer.nextIs('(')
    const condition = buildExpression(lexer, state, context)
    lexer.nextIs(')')

    const trueStart = lexer.peek().span
    const fork = context.fork(trueStart)
    const trueContext = parseBlock(lexer, state, fork.split(trueStart, {}))
    const trueProgram = state.program.take()

    if (lexer.peek().token == 'else') {
      const elseToken = lexer.nextIs('else')

      const falseContext = parseBlock(lexer, state, fork.split(elseToken.span, {}))
      const falseProgram = state.program.take()

      state.program.append(preProgram)
      solveCondition(state, context, condition, null, elseID)
      state.program.append(trueProgram)

      solveJMP(state, context, elseToken.span, endID)

      solveLabel(state, context, elseToken.span, elseID)
      state.program.append(falseProgram)
      solveLabel(state, context, falseContext.end, endID)

      fork.join(falseContext.end)
      return true
    }

    // if without else
    state.program.append(preProgram)
    solveCondition(state, context, condition, null, endID)
    state.program.append(trueProgram)

    solveLabel(state, context, trueContext.end, endID)

    fork.join(trueContext.end)
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

    const blocKStart = lexer.peek().span
    const fork = context.fork(blocKStart)
    const block = parseBlock(lexer, state, fork.split(blocKStart, {}))
    state.program.append(incrementProgram)

    solveJMP(state, context, block.begin, startID)

    solveLabel(state, context, block.end, endID)

    fork.join(block.end)
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
    lexer.nextIs('asm')
    lexer.nextIs('{')

    while (lexer.hasNext()) {
      const next = lexer.next()
      if (next.token == '}') break

      if (conditionalJump.includes(next.token as CodntionalJump)) {
        const label = lexer.next('string').token as LabelName

        solveBNC(state, context, next.span, next.token as CodntionalJump, label)
        continue
      }

      if (next.token == 'jmp') {
        const label = lexer.next('string').token as LabelName

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

type BaseNode = { type: string, span: Span, nodeID: string }
type EntryNode = BaseNode & { type: 'entry', entries: RegisterID[], next: RegOrNullNode, prev: RegOrNullNode }
type DeclareNode = BaseNode & { type: 'declare', id: RegisterID, value: RegisterVariable, isLast: boolean, next: RegOrNullNode, prev: RegOrNullNode }
type UseNode = BaseNode & { type: 'use', id: RegisterID, value: RegisterVariable, isLast: boolean, next: RegOrNullNode, prev: RegOrNullNode }
type SplitNode = BaseNode & { type: 'split', joinNode: JoinNode | null, children: EntryNode[], prev: RegisterNode }
type JoinNode = BaseNode & { type: 'join', splitNode: SplitNode, parents: RegisterNode[], next: RegOrNullNode }

type RegisterNode = EntryNode | DeclareNode | UseNode | SplitNode | JoinNode
type RegOrNullNode = RegisterNode | null

type Context = {
  didReturn?: boolean
  resolve: (span: Span, name: string, noRegNode?: boolean) => VariableOperand | FunctionVariable
  unresolve: (span: Span, name: string, noRegNode?: boolean) => void
  addRegister: (span: Span, name: string, type: Type) => RegisterVariable
  entryNode: EntryNode,
  lastNode: RegisterNode,
  contextVariable: ContextVariable,
  fork: (span: Span) => {
    split: (span: Span, statements: ContextVariable) => Context,
    join: (span: Span) => void
  }
  stack: {
    size: number,
    names: {[key: string]: StackOrGlobalVariable | undefined}
    positions: StackOrGlobalVariable[]
  }
  begin: Span,
  end: Span,
  functionContext: FunctionContext,
}

// return node or null if not found
function chainLookup(node: RegOrNullNode, name: string): DeclareNode | UseNode | null {
  while (node) {
    switch (node.type) {
      case 'declare':
      case 'use':
        if (node.value.name == name) return node
        node = node.prev
        break

      case 'join':
        node = node.splitNode
        break

      case 'entry':
      case 'split':
        node = node.prev
        break

      default:
        assertUnreachable(node)
    }
  }

  return node // null
}

function addToChain(context: Context, element: DeclareNode | UseNode | SplitNode) {
  function walkBranch(node: RegOrNullNode, splitted: boolean) {
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
          break

        case 'entry':
          node.entries.push(element.id)
          node = node.prev
          break

        case 'split':
          if (splitted) {
            return
          }

          node = node.prev
          break

        case 'join':
          node.parents.forEach(parent => walkBranch(parent, true))
          node = node.splitNode
          break

        default:
          assertUnreachable(node)
      }
    }

    assertSpan(element.value.span, false, 'Invalid node insertion')
  }

  if (element.type == 'use') {
    walkBranch(context.lastNode, false)
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
        break

      case 'split':
        node = node.joinNode
        break

      default:
        assertUnreachable(node)
    }
  }

  return lastNode
}

class Stack {
  size = 0
  positions = []
  names: {[key: string]: Type} = {}

  add(name: string, value: Type) {
    this.names[name] = value
  }

  get(span: Span, name: string): Type {
    const value = this.names[name]

    assertSpan(span, value, `Cannot resolve name: '${name}' in stack`)
    return value
  }
}

class ContextClass {
  didReturn = false
  stack = new Stack()

  begin: Span
  end: Span

  construnctor(parent: Context, contextVariable: ContextVariable) {

  }
}

const a = new ContextClass()
let b = a.begin

function createContext(parent: Context, contextVariable: ContextVariable): Context {
  const entryNode: EntryNode = {
    type: 'entry',
    entries: [],
    prev: parent.lastNode,
    next: null,
    span: basicSpan,
    nodeID: `node_${nextInt()}`
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
    contextVariable,
    resolve: (span: Span, name: string, noRegNode?: boolean) => {
      if (!noRegNode) {

        const node = chainLookup(context.lastNode, name)

        if (node) {

          const value: RegisterVariable = {
            ...node.value,
            id: `${node.id}_${nextInt()}` as RegisterID
          }

          addToChain(context, {
            type: 'use',
            id: node.id,
            prev: context.lastNode,
            value: value,
            isLast: true,
            next: null,
            span,
            nodeID: `node_${nextInt()}`
          })

          return value
        }
      }

      const stack = context.stack.names[name]
      if (stack) return stack

      const ret = parent.resolve(span, name, true)

      assertSpan(span, ret || noRegNode, `Unable to resolve name '${name}'`)

      return ret
    },
    unresolve: (span: Span, name: string) => {
      const node = chainLookup(context.lastNode, name)
      assertSpan(span, !node, `Cannot redifine register '${name} defined at: ${span.print}`)

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
        span,
        nodeID: `node_${nextInt()}`
      })

      return node
    },
    fork: (span: Span) => {
      const splitNode: SplitNode = {
        type: 'split',
        prev: context.lastNode,
        joinNode: null,
        children: [],
        span,
        nodeID: `node_${nextInt()}`
      }

      addToChain(context, splitNode)

      function split(span: Span, statements: ContextVariable) {
        assert(context.lastNode == splitNode, 'Invalid split')

        const child = createContext(context, statements)
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
          span,
          nodeID: `node_${nextInt()}`
        }

        // go through each child to find the end
        splitNode.children.forEach(child => {
          const node = getToEnd(child)

          assert(node.type != 'split', 'Split directly before join?')

          node.next = joinNode
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

  while (lexer.hasNext() && lexer.peek().token != '}' && !context.didReturn) {

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

    if(parseReturn(lexer, state, context)) continue

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

  // Heap start is label because in known only in second pass
  solveLabel(state, context, basicSpan, '__HEAP_START__' as LabelName)
  state.program.take()

  while (lexer.hasNext()) {

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

  context.stack.positions.forEach(declaration => {
    assert(declaration.type == 'global', 'Impossible')

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
    } as Context, {})
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

// size is the int size, signed in msb
type MapInfo = {
  info: RegisterInfo,
  node: DeclareNode | UseNode,
  availableReg: AvailableRegs[]
}

type RegisterMap = {[key: RegisterID]:  MapInfo| undefined}
function assemble(state: State): RegisterMap {
  // solve register selection

  const map: RegisterMap = {}

  function solveBranch(entry: EntryNode, fun: FunctionContext) {
    let available = [...availableRegs]

    // used in other branches
    entry.entries.forEach(entry => {
      const reg = map[entry]
      assert(reg, 'Impossible')

      available = available.filter(el => el != reg.info.register)
    })

    let node: RegOrNullNode = entry.next

    while (node) {
      switch (node.type) {
        case 'declare':
          let reg: AvailableRegs

          if (node.value.name == '__return') {
            if (fun.returnRegister) {
              reg = fun.returnRegister
            } else {
              reg = available.shift()!
              fun.returnRegister = reg
            }
          } else {
            reg = available.shift()!
          }

          assertSpan(node.value.span, reg, 'No reg left!')

          map[node.id] = {
            info:  {
              register: reg,
              name: node.value.name,
              type: node.value.dataType,
              span: node.span
            },
            node,
            availableReg: [...available]
          }

          if (!fun.usedRegisters.includes(reg)) {
            fun.usedRegisters.push(reg)
          }

          if (node.isLast) {
            available.unshift(reg)
          }

          node = node.next

          break

        case 'use':
          const declaredReg = map[node.id]
          assert(declaredReg, 'Impossible')

          map[node.value.id] = {
            info: declaredReg.info,
            node,
            availableReg: [...available]
          }

          if (node.isLast) {
            available.unshift(declaredReg.info.register)
          }

          node = node.next

          break


        case 'entry':
          assert(false, 'Impossible')

        case 'split':
          node.children.forEach(child => solveBranch(child, fun))
          assert(node.joinNode, 'Impossible')
          node = node.joinNode.next
          break

        case 'join':
          return

        default:
          assertUnreachable(node)
      }
    }

    assert(!node, 'Impossible')
    // le fini i node? le fini
  }

  Object.keys(state.functions).forEach(funName => {
    const fun = state.functions[funName]!.function
    solveBranch(fun.context.entryNode, fun)
  })

  // solve opcodes
  function createInfo(reg: string) {
    return {
      register: reg as AvailableRegs,
      name: reg,
      type: wordType,
      span: basicSpan
    }
  }

  type Resolver = {
    resolver: OpcodeResolver,
    result: Instruction | null
  }
  const resolvers: Resolver[] = state.program.instructions.map(r => ({resolver: r, result: null}))

  let lastLabels, newLabels, i = 0
  do {
    let used: MapInfo[] = []
    assert(i < 10, 'Compiling more than 10 passes?')
    lastLabels = newLabels

    const info: Info = {
      pc: PROGRAM_ENTRY_POINT,
      getReg: name => {
        if (name == 'r0') return createInfo('r0')
        if (name == 'sp') return createInfo('sp')
        if (availableRegs.includes(name as AvailableRegs)) return createInfo(name)

        const reg = map[name]
        assert(reg, 'Impossible')


        if (reg.node.type == 'declare') {
          used.push(reg)
        }

        if (reg.node.isLast) {
          used = used.filter(el => el.info.register != reg.info.register)
        }

        return reg.info
      },
      getUsedRegisters: () => {
        return used.map(el => el.info.register)
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

    i++
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

  return map
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

    assert(sourceFile, 'Missing source file')

    assert(!isNaN(programLineNumber), 'Invalid line!')

    // if source is begind
    while (sourceFile.sourceLineNumber < programLineNumber) {
      outProgram.push('')
      outOpcode.push('')
      outSource.push(sourceFile.lines[sourceFile.sourceLineNumber - 1] || '')
      sourceFile.sourceLineNumber++
    }

    outProgram.push(programLine.print)

    if (programLine.opcodes.length) {
      const opcode = programLine.opcodes[0]
      assert(opcode, 'No start opcode')

      state.printable.addresses[opcode.pc!] = outOpcode.length
      outOpcode.push(`${hex(opcode.pc!, 4, false)}: ${opcode.print}`)

      for (let i = 1; i < programLine.opcodes.length; i++) {
        const opcode = programLine.opcodes[i]!
        state.printable.addresses[opcode.pc!] = outOpcode.length
        outOpcode.push(`${hex(opcode.pc!, 4, false)}: ${opcode.print}`)
        outProgram.push('')
      }
    } else {
      outOpcode.push('')
    }

    // if new source is required
    if (programLineNumber >= sourceFile.sourceLineNumber) {
      outSource.push(sourceFile.lines[sourceFile.sourceLineNumber - 1] || '')
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
    return `${outOpcode[line]!.padEnd(36)} | ${prog.padEnd(30)} | ${outSource[line]}`
  })

  document.getElementById('pre')!.innerHTML = printHeader + state.printable.lines.join('\n')
}

function displayViz(state: State, map: RegisterMap) {
  const vizDiv = document.getElementById('viz')!

  // @ts-ignore
  const viz = new Viz();

  console.log(state, map)
  let graph = 'digraph main {\n'

  type ConnReg = {
    name: string,
    first: boolean,
    used: boolean
  }

  const connMap: {[key: string]:  ConnReg | undefined} = {}

  function addBranch(entryNode: EntryNode, fun?: FunctionContext) {
    graph += `
      subgraph cluster_${entryNode.nodeID} {
    `

    if (fun) {
      const funName = fun.name

      graph += `
        label = "Function: ${funName}"
        fontsize = "30pt"
        fontcolor = "Red"

        rank = same; ra_${entryNode.nodeID} [label = "${fun.usedRegisters.includes('ra') ? 'A' : 'X'}"];
        rank = same; rb_${entryNode.nodeID} [label = "${fun.usedRegisters.includes('rb') ? 'B' : 'X'}"];
        rank = same; rc_${entryNode.nodeID} [label = "${fun.usedRegisters.includes('rc') ? 'C' : 'X'}"];
        rank = same; rd_${entryNode.nodeID} [label = "${fun.usedRegisters.includes('rd') ? 'D' : 'X'}"];
        rank = same; re_${entryNode.nodeID} [label = "${fun.usedRegisters.includes('re') ? 'E' : 'X'}"];
        rank = same; rf_${entryNode.nodeID} [label = "${fun.usedRegisters.includes('rf') ? 'F' : 'X'}"];
      `
    }

    let lastNode: RegisterNode = entryNode as RegisterNode
    let node: RegisterNode | null = entryNode.next

    function addDefinition(curr: string, reg: string, name: string) {
      const def = `rank = same; ${reg}_${curr}`
      const label = `[label = "${connMap[reg] ? connMap[reg]!.name : name}"]`
      const blue = connMap[reg]?.used ? '[shape = box, color = blue]' : ''
      const invis = connMap[reg]?.first ? '[shape = trapezium, color = red]' : ''
      return `${def} ${label} ${blue} ${invis};`
    }

    function addRegister(last: string, curr: string, name?: string) {
      graph += `
      subgraph cluster_${curr} {
        label = ""

        ${addDefinition(curr, 'ra', 'A')}
        ${addDefinition(curr, 'rb', 'B')}
        ${addDefinition(curr, 'rc', 'C')}
        ${addDefinition(curr, 'rd', 'D')}
        ${addDefinition(curr, 're', 'E')}
        ${addDefinition(curr, 'rf', 'F')}

        {
          rank = same; ra_${curr} -> rb_${curr} -> rc_${curr} -> rd_${curr} -> re_${curr} -> rf_${curr} [style = invis]
        }

        {
          rank = same; ra_${curr} rb_${curr} rc_${curr} rd_${curr} re_${curr} rf_${curr}
        }

        ${['ra', 'rb', 'rc', 'rd', 're', 'rf'].map(reg => {
          let conn = `${reg}_${last} -> ${reg}_${curr}`
          if (!connMap[reg] || connMap[reg]!.first) return conn + ' [style = invis]'
          return conn
        }).join('\n')}

        edge[ dir = forw, weight = 1 ]
      }\n`
    }

    while (node) {
      switch (node.type) {
        case 'use':
        case 'declare':
          const reg = map[node.value.id]?.info.register
          assert(reg, 'Impossible')

          connMap[reg] = {
            name: node.id,
            first: !connMap[reg],
            used: true
          }

          addRegister(lastNode.nodeID, node.nodeID)

          connMap[reg]!.first = false
          connMap[reg]!.used = false

          if (node.isLast) {
            delete connMap[reg]
          }

          lastNode = node
          node = node.next
          break

        case 'split':
          addRegister(lastNode.nodeID, node.nodeID)

          node.children.forEach(child => {
            assert(node, 'Impossible')
            addRegister(node.nodeID, child.nodeID)
            addBranch(child)
          })

          node = node.joinNode
          assert(node, 'Impossible')

          node.parents.forEach(parent => {
            assert(node, 'Impossible')
            addRegister(parent.nodeID, node.nodeID)
          })

          lastNode = node
          node = node.next

          break

        case 'entry':
          assert(false, 'Impossible')

        case 'join':
          graph += '}\n'
          return

        default:
          assertUnreachable(node)
      }
    }

    graph += '}\n'
  }

  Object.keys(state.functions).forEach(funName => {
    const fun = state.functions[funName]!.function
    addBranch(fun.context.entryNode, fun)
  })

  graph += '}'


  viz.renderSVGElement(graph).then((el: any) => {
    vizDiv.appendChild(el);
  }).catch((e: any) => {
    console.log(e)
  })
}

function compile(source: string, fileName: string): State | null {
  // clear and load common libraries
  console.clear()
  sources = baseSources

  try {

    // split the source code in tokes and save the span
    const tokens = tokenize(source, fileName)

    // create a state rappresenting the source code
    const state = build(tokens)

    const map = assemble(state)

    printProgram(state)

    if (state.defines.__OUTPUT_VIZ__?.value) {
      displayViz(state, map)
    }

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
  const {addresses, lines} = simulation.state.printable
  const pc = simulation.registers.pc.value
  const middle = addresses[pc]
  assert(typeof middle == 'number', 'Invalid PC position')

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
  registers.forEach(register => {
    if (register == 'r0') {
      out.push(`0  = 0x0000`)
      return
    }

    if (register == 'pc') {
      out.push(`0  = ${hex(simulation.registers[register].value, 4, false)}`)
      return
    }

    const regContent = simulation.registers[register]

    if (regContent.value != -1) {
      assert(regContent.inst, 'Impossible')

      const value = hex(regContent.value, 4, false)
      const address = addresses[regContent.inst.pc!]
      assert(typeof address == 'number', 'Invalid address')

      const line = lines[address]!.split('|')
      const printLine = line[line.length - 1]

      const {rName, rType} = regContent.inst
      const name = `${rType} ${rName}`.padEnd(26)

      out.push(`${register.padEnd(2)} = ${value} | ${name} | ${printLine}`)
      return
    }

    out.push(`${register.padEnd(2)} = 0x???? |`)
  })

  document.getElementById('pre')!.innerHTML = printHeader + out.join('\n')

  const printMemory = simulation.state.defines.__PRINT_MEMORY__?.value !== 0
  const printRam = simulation.state.defines.__PRINT_RAM__?.value !== 0

  let mem = `INST COUNT: ${simulation.instCounter}\n\n\nRANDOM ACCESS MEMORY:\n`
  let lastIndex = 0
  simulation.memory.forEach((inst, i) => {
    if (!printMemory && i >= PRAM_BEGIN && i < MEMORY_MAPPED) return
    if (lastIndex < PRAM_BEGIN && i >= PRAM_BEGIN && i < TRAM_BEGIN) mem += '\nPIXEL VIDEO RAM:\n'
    if (lastIndex < TRAM_BEGIN && i >= TRAM_BEGIN && i < PROGRAM_ENTRY_POINT) mem += '\nTILE VIDEO RAM:\n'
    if (lastIndex < PROGRAM_ENTRY_POINT && i >= PROGRAM_ENTRY_POINT && i < MEMORY_MAPPED) mem += '\nEEPROM SOURCECODE:\n'
    if (lastIndex < MEMORY_MAPPED && i >= MEMORY_MAPPED) mem += '\nMEMORY_MAPPED:\n'

    assert(inst, 'Impossibel')

    const isPRAM = i >= PRAM_BEGIN && i < TRAM_BEGIN
    const equal = isPRAM ? '<span style="color:' + getRGB(inst.value) + ';">=</span>' : '='

    const address = addresses[inst.inst!.pc!]
    assert(typeof address == 'number', 'Invalid address')
    const from = lines[address] || 'Unknown source? Che magia as fait?'
    mem += `${hex(i, 4, false)} ${equal} ${hex(inst.value, 4, false)} | ${from}\n`

    lastIndex = i
  })

  if (printMemory || printRam) {
    document.getElementById('memory')!.innerHTML = mem
  }

  // render screen

  const {vga: {TRAMModification, PRAMModification, context, tileContext}} = simulation
  const modifiedTiles: {[key: number]: boolean} = {}

  Object.keys(PRAMModification).forEach(originalIndexString => {
    const originalIndex = Number(originalIndexString)
    const index = originalIndex - PRAM_BEGIN
    const value = PRAMModification[originalIndex]!

    const pixel = index % 64
    const tileIndex = (index - pixel) / 64
    const tile = simulation.vga.tileSet[tileIndex]
    assert(tile, 'Invalid PRAM tile')

    const ctx = tile.context
    const x = pixel % 8
    const y = (pixel - x) / 8

    ctx.fillStyle = getRGB(value);
    ctx.fillRect(x, y, 1, 1)

    modifiedTiles[tileIndex] = true
    modifiedTiles[tileIndex] = true
    delete PRAMModification[originalIndex]
  })

  function drawTileAt(context: CanvasRenderingContext2D, value: number, index: number) {
    const x = index % 80
    const y = (index - x) / 80

    const tile = simulation.vga.tileSet[value]
    assert(tile, 'Invalid Tile in TRAM')
    const canvas = tile.canvas
    context.drawImage(canvas, x * 8, y * 8)
  }


  for (let i = 0; i < 4096; i++) {
    const value = simulation.memory[TRAM_BEGIN + i]?.value
    if (value && modifiedTiles[value]) {

      // draw on main screen
      drawTileAt(context, value, i)
    }
  }

  Object.keys(modifiedTiles).forEach(indexString => {
    const index = Number(indexString)
    const canvas = simulation.vga.tileSet[index]!.canvas

    const x = index % 64
    const y = (index - x) / 64

    tileContext.drawImage(canvas, x * 9 + 1, y * 9 + 1)

  })

  Object.keys(TRAMModification).forEach(originalIndexString => {
    const originalIndex = Number(originalIndexString)
    const index = originalIndex - TRAM_BEGIN
    const value = TRAMModification[originalIndex]!

    // draw on main screen
    drawTileAt(context, value, index)

    delete TRAMModification[originalIndex]
  })
}

const MAX_INT = 1 << 16
function simulate(state: State) {
  assert(state, 'no state')

  const canvas = document.getElementById('screen')! as HTMLCanvasElement
  const tileCanvas = document.getElementById('tileMap')! as HTMLCanvasElement

  let entryPoint = state.executable[PROGRAM_ENTRY_POINT]
  assert(entryPoint, 'Invaldi entry point')

  const simulation: Simulation = state.simulation = {
    registers: {
      r0: { value: 0 },
      ra: { value: -1 },
      rb: { value: -1 },
      rc: { value: -1 },
      rd: { value: -1 },
      re: { value: -1 },
      rf: { value: -1 },
      sp: { value: -1 },
      pc: { value: PROGRAM_ENTRY_POINT }
    },
    currInst: entryPoint,
    history: [],
    getRegister: (name: Register): Memory => {
      if (name == 'r0') return {value: 0}
      if (name == 'pc') return simulation.registers.pc

      assertInst(simulation.registers[name].value != -1, `Invalid register access: '${name}'`)
      return simulation.registers[name]
    },
    setRegister: (name: Register, value: number): number => {
      value = (value + MAX_INT) % MAX_INT
      if (name == 'r0') return value

      const prev = simulation.registers[name]
      simulation.history[simulation.history.length - 1]!.push(silent => {
        simulation.registers[name] = prev
      })

      if (name == 'pc') {
        simulation.registers.pc = {value}
        return value
      }

      simulation.registers[name] = {inst: simulation.currInst, value}
      return value
    },
    state,
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
    writeMemory: (index: number, value: number, rewind?: boolean) => {
      const under = index >= 0 && index < PROGRAM_ENTRY_POINT
      const above = index >= MEMORY_MAPPED && index < (1 << 16)

      assertInst(under || above, `Invalid memory write at '${index}' with ${value}`)

      const prev = simulation.memory[index]?.value

      if (typeof prev == 'number' && !rewind) {
        simulation.history[simulation.history.length - 1]!.push(silent => {
          simulation.writeMemory(index, prev, true)
        })
      }

      value = (value + MAX_INT) % MAX_INT
      simulation.memory[index] = {
        value,
        inst: simulation.currInst
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
    memory: state.executable.map(el => ({value: el.opcode, inst: el, decoder: el.exec})),
    vga: {
      canvas,
      context: canvas.getContext('2d')!,
      tileCanvas,
      tileContext: tileCanvas.getContext('2d')!,
      tileSet: [],
      TRAMModification: {},
      PRAMModification: {}
    },
    instCounter: 0,
    stepSimulation: null,
    interrupt: () => {
      if (simulation.memory[MM_INT_EN]?.value) {
        const vector = simulation.memory[MM_INT_VEC]?.value
        assertInst(vector, 'Interrupt vector table not available')
        simulation.registers.pc.value = vector
      }
    }
  }

  // vga standard 640 * 480
  canvas.width = 80 * 8
  canvas.height = 60 * 8

  const size = 64 * 8 + 65
  tileCanvas.width = size
  tileCanvas.height = size

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
    const context = canvas.getContext('2d')!
    canvas.width = 8
    canvas.height = 8

    simulation.vga.tileSet.push({canvas, context})
  }

  function assertInst(condition: any, message: string): asserts condition {
    if (!condition) {
      console.log(simulation.currInst)
      console.log(message);
      throw message
    }
  }

  function step(silent: boolean) {
    const nextInst = simulation.memory[simulation.registers.pc.value]
    const error = `Next inst not executable at '${simulation.registers.pc.value}'\nLast inst:${simulation.currInst.inst!.print}`

    const prev = simulation.currInst
    assertInst(nextInst && nextInst.decoder && nextInst.inst, error)
    simulation.currInst = nextInst.inst

    const {decoder, inst} = nextInst

    if (!silent) {
      console.log(`Executing: ${inst.print.padEnd(32)}, ${inst.inst?.span.print}`)
    }

    assertInst(decoder, 'No exec')

    simulation.instCounter++
    simulation.registers.pc.value++

    simulation.history.push([(silent) => {
      if (!silent) {
        console.log(`Rewinding: ${inst.print}`)
      }

      simulation.instCounter--
      simulation.registers.pc.value--
      simulation.currInst = prev
    }])

    decoder(simulation)
  }

  function rewind(silent: boolean) {
    if (!simulation.history.length) return

    const actions = simulation.history.pop()!
    actions.forEach(action => {
      action(silent)
    })
  }

  simulation.stepSimulation = (count, silent = false) => {
    for (let i = 0; i < -count; i++) {
      rewind(silent)
    }

    for (let i = 0; i < count; i++) {
      try {
        step(silent)
      } catch (e1: any) {
        console.log(e1);

        try {
          assertSpan(simulation.currInst.inst!.span, false, e1)
        } catch(e2: any) {
          simulation.stepSimulation = null
          document.getElementById('pre')!.innerHTML = e2
        }

        return
      }
    }

    printState(simulation)
  }

  printState(simulation)
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

  function compileButtonHandler() {
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

  compileButton.onclick = compileButtonHandler

  function runButtonHandler() {
    if (!state) compileButtonHandler()

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

  runButton.onclick = runButtonHandler


  continuousButton.onclick = () => {
    if (!state) runButtonHandler()

    // if failed to compile
    if (state) {
      continuous = !continuous
      continuousButton.innerHTML = continuous ? 'Stop!' : 'Start'
    }
  }

  focusButton.onclick = () => {
    if (!state) runButtonHandler()

    // if failed to compile
    if (state) {
      focus = !focus
      focusButton.innerHTML = focus ? 'Exit!' : 'Focus!'
    }
  }


  window.setInterval(() => {
    if (state?.simulation?.stepSimulation && continuous) {
      state.simulation.interrupt()
      state.simulation.stepSimulation(1000, true)
    }
  }, 1000/60)

  window.addEventListener('keydown', e => {
    // console.log(e)

    if (state && state.simulation) {
      const simulation = state.simulation
      if (!simulation.stepSimulation) return

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

        type MappedKeys = keyof typeof map

        if (map[e.key as MappedKeys]) {
          simulation.writeMemory(MM_KEYBOARD, map[e.key as MappedKeys])
          simulation.stepSimulation(0)
        }

        if (!e.ctrlKey) {
          e.preventDefault()
        }

        return
      }

      if (e.key == 'n' && simulation.stepSimulation) {
        simulation.stepSimulation(1)
      }

      if (e.key == 'b' && simulation.stepSimulation) {
        simulation.stepSimulation(-1)
      }

      if (e.key == 'm') {
        simulation.stepSimulation(10000, true)
      }

      if (e.key == ',') {
        simulation.stepSimulation(100000, true)
      }

      if (e.key == 'c') {
        compileButtonHandler()
        compileButtonHandler()
      }

      if (e.key == 'ArrowUp') {
        if (simulation.memory[simulation.registers.pc.value - 1]) {
          simulation.registers.pc.value--
          simulation.stepSimulation(0)
        }
        e.preventDefault()
      }

      if (e.key == 'ArrowDown') {
        if (simulation.memory[simulation.registers.pc.value + 1]) {
          simulation.registers.pc.value++
          simulation.stepSimulation(0)
        }
        e.preventDefault()
      }
    }

    if (compiling) {
      if (e.key == 'r') {
        runButtonHandler()
      }

      if (e.key == 'e') {
        compileButtonHandler()
      }
    }
  })

  runButtonHandler()

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
