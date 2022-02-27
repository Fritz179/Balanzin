import timer from './timer.js';
const colors = {
    waterHeight: '#F00',
    measured: '#00F',
    klappeHeight: '#0F0',
    wantedHeight: '#000'
};
import getInput from './getInput.js';
import assert from './assert.js';
import { states } from './main.js';
let displayLen = getInput('lenInput', val => displayLen = val * 60) * 60;
function drawGraph() {
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    assert(canvas && ctx, 'Draw not defined');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const h = canvas.height;
    const dx = canvas.width / displayLen;
    // @ts-ignore
    Object.keys(colors).forEach((type) => {
        const start = Math.max(0, states.length - displayLen);
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
const wall = '#333';
const water = '#095ce0';
const klappa = '#F00';
function drawDrawing() {
    const canvas = document.getElementById('drawing');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const t = h / 10;
    const kBotom = t * 5;
    const { klappeHeight, waterHeight } = states[states.length - 1];
    const f = t * document.getElementById('offset').value;
    const closed = true;
    const kHeight = t * 3 * klappeHeight;
    const wHeight = t * 3 * waterHeight;
    const wOver = wHeight - kHeight;
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = water;
    ctx.fillRect(0, t - f, t + f, f); // top left
    ctx.fillRect(t, t, f, h - t * 2); // drip
    ctx.fillRect(t, h - t * 2, w - t * 4, t); // bottom
    if (!closed)
        ctx.fillRect(w - t * 3, h - t * 2, 3 * t, t);
    // all water => walls and klappa will be drawn over
    ctx.fillRect(t, kBotom - wHeight, w - t * 4, h); // all
    if (wOver > 0) {
        ctx.fillRect(w - t * 3, kBotom - wHeight, t + wOver, 2 * t + wHeight); // top
        ctx.fillRect(w - t * 2, h - t * 3 - wOver, t * 2, wOver); // right
    }
    ctx.fillStyle = wall;
    ctx.fillRect(0, t, t, h - t); // left side
    ctx.fillRect(t * 2, 0, w - t * 4, t); // top
    ctx.fillRect(0, h - t, w, t); // bottom
    ctx.fillRect(w - t * 3, t, t, t); // right top
    ctx.fillRect(w - t * 3, kBotom, t, h - kBotom - t * 2); // right middle
    ctx.fillRect(w - t * 2, h - t * 3, t * 2, t); // right bottom
    if (closed)
        ctx.fillRect(w - t * 3, h - t * 2, t, t);
    ctx.fillStyle = klappa;
    ctx.fillRect(w - t * 3, kBotom - kHeight, t, kHeight);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (closed) {
        ctx.moveTo(t, h - t * 6.5);
        ctx.lineTo(w - t * 3, h - t * 6.5);
    }
    else {
        ctx.moveTo(t, h - t * 4);
        ctx.lineTo(w - t * 3, h - t * 4);
    }
    ctx.stroke();
}
timer.draw = () => {
    drawGraph();
    drawDrawing();
};
