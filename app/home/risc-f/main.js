// npx tsc ./main.ts --outDir ../risc-f --module es2020 --target es2020 --strict --strictNullChecks
import compile from './compile.js';
import print from './print.js';
import run from './run.js';
import { assert } from './assert.js';
window.addEventListener('load', () => {
    const source = document.getElementById('source');
    const parseButton = document.getElementById('parse');
    const runButton = document.getElementById('run');
    const lowButton = document.getElementById('low');
    const highButton = document.getElementById('high');
    const output = document.getElementById('output');
    let sending = false;
    async function send(bytes) {
        if (sending) {
            output.innerHTML = 'ERROR: Already writing bytes';
            output.classList.add('error');
            return;
        }
        sending = true;
        output.innerHTML = 'Sending bytes...';
        output.classList.remove('error');
        const url = 'http://raspberrypi.local:17980/';
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(bytes)
        }).catch(_e => {
            output.innerHTML = 'ERROR: Cannot connect to ' + url;
            output.classList.add('error');
        });
        if (!res)
            return;
        const text = await res.text();
        output.innerHTML = text;
        if (res.status == 200) {
            output.classList.remove('error');
        }
        else {
            output.classList.add('error');
        }
        sending = false;
    }
    lowButton.onclick = () => send(parse(request.lowBytes));
    highButton.onclick = () => send(parse(request.highBytes));
    let request;
    (function (request) {
        request[request["highBytes"] = 0] = "highBytes";
        request[request["lowBytes"] = 1] = "lowBytes";
        request[request["program"] = 2] = "program";
        request[request["nothing"] = 3] = "nothing";
    })(request || (request = {}));
    function parse(requestType) {
        run([]);
        try {
            // @ts-ignore
            const program = compile(source.value);
            output.innerHTML = print(program);
            output.classList.remove('error');
            // for run button
            if (requestType == request.nothing)
                return [];
            if (requestType == request.program)
                return program;
            const opcodes = [];
            for (const { opcode, bytePos } of program) {
                if (opcode != null) {
                    if (bytePos != opcodes.length) {
                        output.innerHTML = 'Illegal opcode sequence';
                        output.classList.add('error');
                        assert(false, 'unreachable');
                    }
                    if (requestType == request.highBytes) {
                        opcodes.push(opcode >> 8);
                    }
                    else {
                        opcodes.push(opcode & 255);
                    }
                }
            }
            return opcodes;
        }
        catch (e) {
            console.error(e);
            output.innerHTML = e;
            output.classList.add('error');
            if (e instanceof Error) {
                throw e;
            }
            return [];
        }
    }
    parseButton.onclick = () => parse(request.nothing);
    runButton.onclick = () => {
        run(parse(request.program));
    };
    parse(request.nothing);
});
