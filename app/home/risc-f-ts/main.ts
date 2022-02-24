// npx tsc ./main.ts --outDir ../risc-f --module es2020 --target es2020 --strict --strictNullChecks --forceConsistentCasingInFileNames -w

/*
  TODO:
    - compiler directives => add more
    - constant propagator => add solver function during arg parsing?
    - remove all as and ignore
    - better graphics => Canvas
    - llvm? tcc...
*/

import compile from './compiler/compiler.js'
import run from './runner/runner.js'
import send from './send.js'

window.addEventListener('load', () => {
  const source = document.getElementById('source')! as HTMLTextAreaElement
  const parseButton = document.getElementById('parse')!
  const runButton = document.getElementById('run')!
  const lowButton = document.getElementById('low')!
  const highButton = document.getElementById('high')!

  lowButton.onclick = () => send(compile(source.value), true)
  highButton.onclick = () => send(compile(source.value), false)

  parseButton.onclick = () => compile(source.value)
  runButton.onclick = () => run(compile(source.value))

  run(compile(source.value))
})

