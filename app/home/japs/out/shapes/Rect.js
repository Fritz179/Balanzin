import Vec2 from './Vec2.js';
import { Point, Line } from './Shape.js';
import { assertUnreachable } from '../assert.js';
export default class Rect extends Point {
    size;
    constructor(x, y, w, h) {
        super(x, y);
        this.size = new Vec2(w, h);
    }
    get w() { return this.size.x; }
    get h() { return this.size.y; }
    set w(w) { this.size.x = w; }
    set h(h) { this.size.y = h; }
    get x1() { return this.x; }
    get y1() { return this.y; }
    get x2() { return this.x + this.w; }
    get y2() { return this.y + this.h; }
    set x1(x) { this.x = x; }
    set y1(y) { this.y = y; }
    set x2(x) { this.x = x - this.w; }
    set y2(y) { this.y = y - this.h; }
    intersects(other) {
        if (other instanceof Rect) {
            return Rect.intersectsRect(this, other);
        }
        if (other instanceof Line) {
            return Rect.intersectsLine(this, other);
        }
        if (other instanceof Point) {
            return Rect.intersectsPoint(this, other);
        }
        console.log(other);
        assertUnreachable('Invalid collision type');
    }
    static intersectsRect(self, other) {
        return !(self.x1 > other.x2 ||
            self.x2 < other.x1 ||
            self.y1 > other.y2 ||
            self.y2 < other.y1);
    }
    static solveRect(self, other) {
        const contact = new Point(0, 0);
        const normal = new Vec2(0, 0);
    }
    static intersectsLine(rect, line, contact, normal) {
        let nearX = (rect.x1 - line.x) / line.w;
        let nearY = (rect.y1 - line.y) / line.h;
        let farX = (rect.x2 - line.x) / line.w;
        let farY = (rect.y2 - line.y) / line.h;
        if (nearX > farX)
            [nearX, farX] = [farX, nearX];
        if (nearY > farY)
            [nearY, farY] = [farY, nearY];
        if (nearX > farY || nearY > farX)
            return false;
        const near = Math.max(nearX, nearY);
        const far = Math.min(farX, farY);
        if (far < 0 || near > 1)
            return false;
        if (contact) {
            contact.x = line.x + near * line.w;
            contact.y = line.y + near * line.h;
        }
        if (normal) {
            if (nearX > nearY) {
                if (line.w < 0) {
                    normal.set(1, 0);
                }
                else {
                    normal.set(-1, 0);
                }
            }
            else {
                if (line.h < 0) {
                    normal.set(0, 1);
                }
                else {
                    normal.set(0, -1);
                }
            }
        }
        return true;
    }
    static intersectsPoint(self, other) {
        assertUnreachable();
    }
}
