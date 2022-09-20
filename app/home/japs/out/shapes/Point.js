import Vec2 from './Vec2.js';
export default class Point {
    pos;
    constructor(x, y) {
        this.pos = new Vec2(x, y);
    }
    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    set x(x) { this.pos.x = x; }
    set y(y) { this.pos.y = y; }
    intersects(other) {
    }
}
