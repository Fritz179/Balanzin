import JAPSUpdater from './JAPSUpdater.js';
import JAPSRenderer from './JAPSRenderer.js';
import JapsCollider from './JAPSCollider.js';
import { Rect, Circle, Line } from '../math/Shape.js';
import Entity from '../Entity.js';
import Vec2 from '../math/Vec2.js';
const screen = document.getElementById('screen');
export default class JAPS extends Rect {
    updater = new JAPSUpdater(this);
    renderer = new JAPSRenderer(this, screen);
    collider = new JapsCollider(this);
    mouse = new Vec2(0, 0);
    constructor(w, h) {
        super(0, 0, w, h);
        this.renderer.setCanvasSize(w, h);
    }
    update() {
        this.updater.updateStart();
        this.collider.collide();
        this.updater.updateEnd();
    }
    render() {
        this.renderer.render();
    }
    mouseClick(x, y, _e) {
        const num = Math.random();
        let shape = new Rect(x, y, 20, 20);
        if (num < 0.6)
            shape = new Circle(x, y, 20);
        if (num < 0.3)
            shape = new Line(x, y, 20, 20);
        const entity = new Entity(shape);
        // entity.register(this, true)
    }
    mouseMove(x, y, _e) {
        this.mouse.set(x, y);
    }
    key(key) {
        const { x, y } = this.mouse;
        let shape = null;
        if (key == 'r')
            shape = new Rect(x, y, 20, 20);
        if (key == 'c')
            shape = new Circle(x, y, 20);
        if (key == 'l')
            shape = new Line(x, y, 20, 20);
        if (shape) {
            const entity = new Entity(shape);
            entity.register(this, true);
        }
    }
}
