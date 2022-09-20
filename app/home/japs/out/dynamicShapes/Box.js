import Rect from '../shapes/Rect.js';
import Vec2 from '../shapes/Vec2.js';
export default class Box extends Rect {
    vel = new Vec2(0, 0);
    get xv() { return this.vel.x; }
    get yv() { return this.vel.y; }
    set xv(x) { this.vel.x = x; }
    set yv(y) { this.vel.y = y; }
    solveCollision(other) {
    }
}
