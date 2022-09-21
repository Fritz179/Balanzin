import JAPSUpdater from './handlers/JAPSUpdater.js';
import JAPSRenderer from './handlers/JAPSRenderer.js';
import JAPSCollider from './handlers/JAPSCollider.js';
import JAPSKeyboard from './handlers/JAPSKeyboard.js';
import JAPSMouse from './handlers/JAPSMouse.js';
import { Rect } from './math/Shape.js';
import { listen, unlisten } from './listen.js';
import Timer from './Timer.js';
const screen = document.getElementById('screen');
export class JAPS extends Rect {
    updater = new JAPSUpdater(this);
    renderer = new JAPSRenderer(this, screen);
    collider = new JAPSCollider(this);
    keyboard = new JAPSKeyboard(this);
    mouse = new JAPSMouse(this);
    timer = new Timer(60, this.update.bind(this), this.render.bind(this));
    constructor(w, h) {
        super(0, 0, w, h);
        listen(this);
        this.renderer.setCanvasSize(w, h);
    }
    destroy() {
        // Timer has requestAnimationFrame
        this.timer.stop();
        // Remove all listeners
        unlisten();
    }
    update() {
        this.updater.updateStart();
        this.collider.collide();
        this.updater.updateEnd();
    }
    render() {
        this.renderer.render();
    }
}
export default class Game extends JAPS {
    constructor(w, h) {
        super(w, h);
        this.timer.start();
    }
}
