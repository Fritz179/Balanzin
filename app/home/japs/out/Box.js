import Rect from './shapes/Rect.js';
import Vec2 from './shapes/Vec2.js';
export default class Box extends Rect {
    constructor() {
        super(...arguments);
        this.vel = new Vec2(0, 0);
    }
    get xv() { return this.vel.x; }
    get yv() { return this.vel.y; }
    set xv(x) { this.vel.x = x; }
    set yv(y) { this.vel.y = y; }
    register(parent, registering) {
        parent.updater.register(this, registering);
        parent.renderer.register(this, registering);
    }
}
