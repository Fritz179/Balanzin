export default class Vec2 {
    x;
    y;
    constructor(x, y) {
        if (typeof x == 'number') {
            if (typeof y == 'number') {
                this.x = x;
                this.y = y;
                return;
            }
            this.x = x;
            this.y = x;
            return;
        }
        if (x instanceof Vec2) {
            this.x = x.x;
            this.y = x.y;
            return;
        }
        this.x = 0;
        this.y = 0;
    }
    add(x, y) {
        if (typeof x == 'number') {
            if (typeof y == 'number') {
                this.x += x;
                this.y += y;
                return this;
            }
            this.x += x;
            this.y += x;
            return this;
        }
        this.x += x.x;
        this.y += x.y;
        return this;
    }
    sub(x, y) {
        if (typeof x == 'number') {
            if (typeof y == 'number') {
                this.x -= x;
                this.y -= y;
                return this;
            }
            this.x -= x;
            this.y -= x;
            return this;
        }
        this.x -= x.x;
        this.y -= x.y;
        return this;
    }
    mul(x, y) {
        if (typeof x == 'number') {
            if (typeof y == 'number') {
                this.x *= x;
                this.y *= y;
                return this;
            }
            this.x *= x;
            this.y *= x;
            return this;
        }
        this.x *= x.x;
        this.y *= x.y;
        return this;
    }
    div(x, y) {
        if (typeof x == 'number') {
            if (typeof y == 'number') {
                this.x /= x;
                this.y /= y;
                return this;
            }
            this.x /= x;
            this.y /= x;
            return this;
        }
        this.x /= x.x;
        this.y /= x.y;
        return this;
    }
    set(x, y) {
        if (typeof x == 'number') {
            if (typeof y == 'number') {
                this.x = x;
                this.y = y;
                return this;
            }
            this.x = x;
            this.y = x;
            return this;
        }
        this.x = x.x;
        this.y = x.y;
        return this;
    }
}
const Normals = {
    up: new Vec2(0, -1),
    right: new Vec2(1, 0),
    down: new Vec2(0, 1),
    left: new Vec2(-1, 0)
};
export { Normals };
