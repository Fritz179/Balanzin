// npx tsc ./main.ts --outDir ../risc-f --module es2020 --target es2020 --strict --strictNullChecks --forceConsistentCasingInFileNames -w
/*
  TODO:
    - constant propagator
    - llvm? tcc...
    - better graphics => Canvas
    - remove all as and ignore
*/
import compile from './compiler/compiler.js';
import run from './run.js';
import send from './send.js';
window.addEventListener('load', () => {
    const source = document.getElementById('source');
    const parseButton = document.getElementById('parse');
    const runButton = document.getElementById('run');
    const lowButton = document.getElementById('low');
    const highButton = document.getElementById('high');
    lowButton.onclick = () => send(compile(source.value), true);
    highButton.onclick = () => send(compile(source.value), false);
    parseButton.onclick = () => compile(source.value);
    runButton.onclick = () => run(compile(source.value));
    run(compile(source.value));
});
