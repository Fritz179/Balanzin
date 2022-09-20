export default class Vec2 {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
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
