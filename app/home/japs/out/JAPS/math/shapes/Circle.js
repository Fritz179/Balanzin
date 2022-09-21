import Vec2 from '../Vec2.js';
import { Rect, Line, Point } from '../Shape.js';
import { assertUnreachable, assertUnimplemented } from '../../assert.js';
export default class Circle {
    pos;
    r;
    constructor(x, y, r) {
        this.pos = new Vec2(x, y);
        this.r = r;
    }
    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    get d() { return this.r * 2; }
    get w() { return this.r * 2; }
    get h() { return this.r * 2; }
    set x(x) { this.pos.x = x; }
    set y(y) { this.pos.y = y; }
    set d(d) { this.r = d / 2; }
    set w(w) { this.r = w / 2; }
    set h(h) { this.r = h / 2; }
    get x1() { return this.x - this.r; }
    get y1() { return this.y - this.r; }
    get x2() { return this.x + this.r; }
    get y2() { return this.y + this.r; }
    set x1(x) { this.x = x + this.r; }
    set y1(y) { this.y = y + this.r; }
    set x2(x) { this.x = x - this.r; }
    set y2(y) { this.y = y - this.r; }
    intersects(other) {
        if (other instanceof Rect) {
            return Rect.intersectsCircle(other, this);
        }
        if (other instanceof Circle) {
            return Circle.intersectsCircle(this, other);
        }
        if (other instanceof Line) {
            return Circle.intersecstLine(this, other);
        }
        if (other instanceof Point) {
            return Circle.intersectsPoint(this, other);
        }
        assertUnreachable(other);
    }
    static intersectsCircle(self, other) {
        const dist2 = Math.abs((self.x - other.x) ** 2 + (self.y - other.y) ** 2);
        return dist2 < ((self.r + other.r) * (self.r + other.r));
    }
    static intersecstLine(circle, line) {
        assertUnimplemented('Circle vs Line');
    }
    static intersectsPoint(circle, point) {
        const dist2 = (circle.x - point.x) ** 2 + (circle.y - point.y) ** 2;
        return dist2 < (circle.r ** 2);
    }
}
