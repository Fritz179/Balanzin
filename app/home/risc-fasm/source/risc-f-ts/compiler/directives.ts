import {arg} from './parser.js'
import {assertLine} from '../assert.js'
import {setConst} from './assembler.js'
import evaluator from './evaluator.js'

interface directive {
  [key: string]: (...args: arg[]) => void
}
const directives: directive = {}
export default directives

directives.equ = (arg) => {
  assertLine(arg.type == 'const' && arg.value.length >= 2, 'Error during .equ')

  const [name, ...to] = arg.value

  const num = evaluator(to)
  assertLine(!Number.isNaN(num), 'Invalid value for equ')
  setConst(name, num)
}