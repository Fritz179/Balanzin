import assert from './assert.js';
class Listener {
}
let abortController = null;
function listen(listener) {
    assert(!abortController, 'Game instance already present! Use this.delete() before creating a new one!');
    abortController = new AbortController();
    const signal = abortController.signal;
    window.addEventListener('click', (e) => {
        listener.mouse.click(e);
    }, { signal });
    window.addEventListener('mousemove', (e) => {
        listener.mouse.move(e);
    }, { signal });
    window.addEventListener('keydown', (e) => {
        listener.keyboard.down(e.key);
    }, { signal });
}
function unlisten() {
    assert(abortController, 'Gamer instance already destroyed...');
    abortController.abort();
    abortController = null;
}
export { listen, unlisten };
