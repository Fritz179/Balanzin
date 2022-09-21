import Vec2 from '../Vec2.js';
import { Rect, Circle, Point } from '../Shape.js';
import { assertUnreachable, assertUnimplemented } from '../../assert.js';
export default class Line {
    pos;
    dir;
    constructor(x, y, w, h) {
        this.pos = new Vec2(x, y);
        this.dir = new Vec2(w, h);
    }
    get w() { return this.dir.x; }
    get h() { return this.dir.y; }
    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    set x(x) { this.pos.x = x; }
    set y(y) { this.pos.y = y; }
    set w(w) { this.dir.x = w; }
    set h(h) { this.dir.y = h; }
    // x1 is always on the left while x is the starting point
    get x1() { return this.w >= 0 ? this.x : this.x + this.w; }
    get y1() { return this.h >= 0 ? this.y : this.y + this.h; }
    get x2() { return this.w <= 0 ? this.x : this.x + this.w; }
    get y2() { return this.h <= 0 ? this.y : this.y + this.h; }
    set x1(x) { this.w >= 0 ? this.x = x : this.x = x - this.w; }
    set y1(y) { this.h >= 0 ? this.y = y : this.y = y - this.h; }
    set x2(x) { this.w <= 0 ? this.x = x : this.x = x - this.w; }
    set y2(y) { this.h <= 0 ? this.y = y : this.y = y - this.h; }
    pointTo(x, y) {
        this.dir.x = x - this.x;
        this.dir.y = y - this.y;
    }
    intersects(other) {
        if (other instanceof Rect) {
            return Rect.intersectsLine(other, this);
        }
        if (other instanceof Circle) {
            return Circle.intersecstLine(other, this);
        }
        if (other instanceof Line) {
            return Line.intersectsLine(this, other);
        }
        if (other instanceof Point) {
            return Line.intersectsPoint(this, other);
        }
        assertUnreachable(other);
    }
    static intersectsLine(self, other) {
        return !(self.x1 > other.x2 ||
            self.x2 < other.x1 ||
            self.y1 > other.y2 ||
            self.y2 < other.y1);
    }
    static intersectsPoint(line, point) {
        assertUnimplemented('Line vs Point');
    }
}
