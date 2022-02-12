import parse from './parse.js'
import compile from './compile.js'
import {printParsed} from './print.js'

window.addEventListener('load', () => {
  const source = document.getElementById('source')
  const parseButton = document.getElementById('parse')
  const output = document.getElementById('output')

  parseButton.onclick = () => {
    try {
      const parsed = parse(source.value)
      const program = compile(parsed)

      console.log(program);
      output.innerHTML = printParsed(program)
    } catch (e) {
      console.error(e);
      output.innerHTML = e
    }
  }

  parseButton.onclick()
})

