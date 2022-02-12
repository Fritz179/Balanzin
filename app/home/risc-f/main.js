import parse from './parse.js'
import compile from './compile.js'
import print from './print.js'

window.addEventListener('load', () => {
  const source = document.getElementById('source')
  const parseButton = document.getElementById('parse')
  const output = document.getElementById('output')

  parseButton.onclick = () => {
    try {
      const parsed = parse(source.value)
      const program = compile(parsed)

      console.log(program);
      output.innerHTML = print(program)
    } catch (e) {
      console.error(e);
      output.innerHTML = e

      if (e instanceof Error) {
        throw e
      }
    }
  }

  parseButton.onclick()
})

