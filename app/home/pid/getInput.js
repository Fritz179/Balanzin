import timer from './timer.js';
import assert from './assert.js';
export default function getInput(name, callback) {
    const label = document.querySelector(`label[for="${name}"]`);
    const originalText = label.innerHTML;
    const input = document.getElementById(name);
    input.oninput = () => {
        label.innerHTML = originalText + `: ${input.value}`;
        callback(Number(input.value));
        assert(timer.draw, 'Draw not defined');
        timer.draw();
    };
    label.innerHTML = `${originalText}: ${input.value}`;
    return Number(input.value);
}
