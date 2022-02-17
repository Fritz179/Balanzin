// npx tsc ./main.ts --outDir ../risc-f --module es2020 --target es2020 --strict --strictNullChecks --forceConsistentCasingInFileNames
import compile from './compiler/compiler.js';
// import print from './print.js'
import run from './run.js';
import send from './send.js';
window.addEventListener('load', () => {
    const source = document.getElementById('source');
    const parseButton = document.getElementById('parse');
    const runButton = document.getElementById('run');
    const lowButton = document.getElementById('low');
    const highButton = document.getElementById('high');
    const output = document.getElementById('output');
    lowButton.onclick = () => send(compile(source.value), true);
    highButton.onclick = () => send(compile(source.value), false);
    parseButton.onclick = () => compile(source.value);
    runButton.onclick = () => {
        run(compile(source.value));
    };
    run(compile(source.value));
});
