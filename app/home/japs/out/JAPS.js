import JAPSUpdater from './JAPS/JAPSUpdater.js';
import JAPSRenderer from './JAPS/JAPSRenderer.js';
import JapsCollider from './JAPS/JAPSCollider.js';
import { Rect, Line } from './math/Shape.js';
const screen = document.getElementById('screen');
export default class JAPS extends Rect {
    updater = new JAPSUpdater(this);
    renderer = new JAPSRenderer(this, screen);
    collider = new JapsCollider(this);
    line = new Line(0, 0, 0, 0);
    intersecting = false;
    constructor(w, h) {
        super(0, 0, w, h);
        this.renderer.setCanvasSize(w, h);
    }
    update() {
        this.intersecting = false;
        this.updater.updateStart();
        this.collider.collide();
        this.collider.children.forEach(child => {
            if (child.intersects(this.line)) {
                child.onCollision(this.line, () => { });
                this.intersecting = true;
            }
        });
        this.updater.updateEnd();
    }
    render() {
        this.renderer.render();
        const ctx = this.renderer.ctx;
        ctx.strokeStyle = '#000';
        if (this.intersecting) {
            ctx.strokeStyle = '#F00';
        }
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.line.dir.x, this.line.dir.y);
        ctx.stroke();
    }
    mouseMove(x, y, e) {
        this.line.dir.set(x, y);
    }
}
