"use strict";
const colors = {
    realHeight: '#F00',
    measured: '#00F',
    change: '#0F0',
    wantedHeight: '#000'
};
window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    function getInput(name, callback) {
        const label = document.querySelector(`label[for="${name}"]`);
        const originalText = label.innerHTML;
        const input = document.getElementById(name);
        input.oninput = () => {
            label.innerHTML = originalText + `: ${input.value}`;
            callback(Number(input.value));
            draw();
        };
        label.innerHTML = `${originalText}: ${input.value}`;
        return Number(input.value);
    }
    let P = getInput('pValue', val => P = val);
    let I = getInput('iValue', val => I = val);
    let D = getInput('dValue', val => D = val);
    let offset = getInput('offset', val => offset = val);
    let displayLen = getInput('lenInput', val => displayLen = val * 60) * 60;
    const maxSpeed = 0.01;
    const delay = 50;
    const states = [];
    for (let i = 0; i < 60 * 60; i++) {
        states.push({
            realHeight: 0.01,
            wantedHeight: 0.01,
            measured: 0,
            error: 0,
            change: 0,
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const h = canvas.height;
        const dx = canvas.width / displayLen;
        // @ts-ignore
        Object.keys(colors).forEach((type) => {
            const start = Math.max(delay, states.length - displayLen);
            ctx.beginPath();
            ctx.moveTo(0, h * (1 - states[start][type]));
            // @ts-ignore
            ctx.strokeStyle = colors[type];
            ctx.lineWidth = 5;
            for (let i = start; i < states.length; i++) {
                ctx.lineTo((i - start) * dx, (1 - states[i][type]) * h);
            }
            ctx.stroke();
        });
    }
    function measure() {
        return states[states.length - delay].realHeight;
    }
    function pid(measured) {
        const wanted = 0.5;
        const err = wanted - measured;
        return err * P;
    }
    function absMax(value, max) {
        if (value > 0)
            return Math.min(value, max);
        return Math.max(value, -max);
    }
    function update() {
        const measured = measure();
        const pidErr = pid(measured);
        const err = absMax(pidErr, maxSpeed);
        let real = states[states.length - 1].realHeight;
        real += err + offset;
        const change = (err + maxSpeed) / maxSpeed / 2;
        states.push({
            realHeight: real,
            wantedHeight: 0.5,
            measured,
            error: err,
            change: change
        });
        draw();
    }
    let id = setInterval(update, 1000 / 60);
    window.addEventListener('keydown', e => {
        if (e.key == ' ') {
            if (id) {
                clearInterval(id);
                id = 0;
            }
            else {
                id = setInterval(update, 1000 / 60);
            }
        }
    });
});
