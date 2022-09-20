import { Rect, Line } from './math/Shape.js';
export default class Entity {
    intersecting = 0;
    bb;
    pos;
    constructor(shape) {
        this.bb = shape;
        this.pos = this.bb.pos;
    }
    register(parent, registering) {
        parent.updater.register(this, registering);
        parent.renderer.register(this, registering);
        parent.collider.register(this, registering);
    }
    updateStart() {
        this.intersecting = 0;
    }
    onCollision(other, solve) {
        this.intersecting = 1;
        if (other instanceof Rect) {
            this.intersecting |= 1;
        }
        if (other instanceof Line) {
            this.intersecting |= 2;
        }
    }
    updateEnd() {
    }
    render(renderer) {
        let fillStyle = '#000';
        if (this.intersecting == 1)
            fillStyle = '#F00';
        if (this.intersecting == 2)
            fillStyle = '#0F0';
        if (this.intersecting == 3)
            fillStyle = '#FF0';
        renderer.shape(this.bb, fillStyle);
    }
}
