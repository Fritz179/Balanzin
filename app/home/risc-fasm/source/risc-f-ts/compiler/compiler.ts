import parse, {compiled} from './parser.js'
import assemble from './assembler.js'
import prettify, {print} from './prettifier.js'

export default function compile(sourceCode: string): compiled[] {
  const output = document.getElementById('output')!

  try {
    const parsed = parse(sourceCode)
    const assembled = assemble(parsed)
    const pretty = prettify(assembled)

    output.innerHTML = print(pretty)
    output.classList.remove('error')

    return pretty
  } catch (e) {
    console.error(e);
    output.innerHTML = e as string
    output.classList.add('error')

    if (e instanceof Error) {
      throw e
    }

    return []
  }
}

