import parse from './parse.js'
import compile from './compile.js'
import print from './print.js'
import run from './run.js'

window.addEventListener('load', () => {
  const source = document.getElementById('source')
  const parseButton = document.getElementById('parse')
  const runButton = document.getElementById('run')
  const lowButton = document.getElementById('low')
  const highButton = document.getElementById('high')
  const output = document.getElementById('output')

  let sending = false
  async function send(bytes) {
    if (sending) {
      output.innerHTML = 'ERROR: Already writing bytes'
      output.classList.add('error')
      return
    }
    sending = true
    output.innerHTML = 'Sending bytes...'
    output.classList.remove('error')

    const url = 'http://raspberrypi.local:17980/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(bytes)
    }).catch(e => {
      output.innerHTML = 'ERROR: Cannot connect to ' + url
      output.classList.add('error')
    })

    if (!res) return
    const text = await res.text()

    output.innerHTML = text
    if (res.status == 200) {
      output.classList.remove('error')
    } else {
      output.classList.add('error')
    }
    sending = false
  }

  low.onclick = () => send(parseButton.onclick(false))
  high.onclick = () => send(parseButton.onclick(true))

  parseButton.onclick = (highBytes) => {
    run(false)
    try {
      const parsed = parse(source.value)
      const program = compile(parsed)

      output.innerHTML = print(program)
      output.classList.remove('error')

      // for run button
      if (highBytes == null) return program

      const opcodes = []
      for (const {opcode, bytePos} of program) {
        if (opcode != null) {
          if (bytePos != opcodes.length) {
            output.innerHTML = 'Illegal opcode sequence'
            output.classList.add('error')
            return false
          }

          if (highBytes) {
            opcodes.push(opcode >> 8)
          } else {
            opcodes.push(opcode & 255)
          }
        }
      }

      return opcodes
    } catch (e) {
      console.error(e);
      output.innerHTML = e
      output.classList.add('error')

      if (e instanceof Error) {
        throw e
      }

      return false
    }
  }

  runButton.onclick = () => {
    run(parseButton.onclick(null));
  }

  runButton.onclick()
})

