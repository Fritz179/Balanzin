import { Rect, Circle, Line, Point } from '../math/Shape.js';
import ChildrenSet from './ChildrenBox.js';
class BasicRenderer {
}
export default class JABSRenderer extends ChildrenSet {
    canvas;
    #ctx;
    children = new Set();
    constructor(master, canvas) {
        super(master);
        this.canvas = canvas;
        this.#ctx = this.canvas.getContext('2d');
    }
    setCanvasSize(w, h) {
        console.log(w, h);
        this.canvas.width = w;
        this.canvas.height = h;
    }
    render() {
        this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.children.forEach(child => {
            child.render(this);
        });
    }
    shape(shape, fill, stroke, width) {
        if (shape instanceof Rect) {
            return this.rect(shape, fill, stroke, width);
        }
        if (shape instanceof Circle) {
            return this.circle(shape, fill, stroke, width);
        }
        if (shape instanceof Line) {
            return this.line(shape, stroke, width);
        }
        if (shape instanceof Point && fill !== false) {
            return this.point(shape, fill, width);
        }
    }
    // rect(rect: Rect): void
    // rect(rect: Rect, fill: string): void
    // rect(rect: Rect, fill: false, stroke: string): void
    // rect(rect: Rect, fill: string, stroke: string): void
    // rect(rect: Rect, fill: false, stroke: string, width: number): void
    // rect(rect: Rect, fill: string, stroke: string, width: number): void
    rect(rect, fill, stroke, width) {
        const ctx = this.#ctx;
        if (stroke)
            ctx.strokeStyle = stroke;
        if (width)
            ctx.lineWidth = width;
        if (fill === false) {
            ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
            return;
        }
        if (fill)
            ctx.fillStyle = fill;
        if (!stroke) {
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
            return;
        }
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
        ctx.fill();
        ctx.stroke();
    }
    // circle(circle: Circle): void
    // circle(circle: Circle, fill: string): void
    // circle(circle: Circle, fill: false, stroke: string): void
    // circle(circle: Circle, fill: string, stroke: string): void
    // circle(circle: Circle, fill: false, stroke: string, width: number): void
    // circle(circle: Circle, fill: string, stroke: string, width: number): void
    circle(circle, fill, stroke, width) {
        const ctx = this.#ctx;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
        if (stroke)
            ctx.strokeStyle = stroke;
        if (width)
            ctx.lineWidth = width;
        if (fill === false) {
            ctx.stroke();
            return;
        }
        if (fill)
            ctx.fillStyle = fill;
        ctx.fill();
    }
    // line(line: Line): void
    // line(line: Line, width: number): void
    // line(line: Line, stroke: string): void
    // line(line: Line, stroke: string, width: number): void
    line(line, a, b) {
        const ctx = this.#ctx;
        if (typeof a == 'string') {
            if (typeof b == 'number') {
                ctx.lineWidth = b;
            }
            ctx.strokeStyle = a;
        }
        if (typeof a == 'number') {
            ctx.lineWidth = a;
        }
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + line.w, line.y + line.h);
        ctx.stroke();
    }
    // point(point: Point): void
    // point(point: Point, fill: string): void
    // point(point: Point, fill: string, width: number): void
    point(point, fill, width = 5) {
        const ctx = this.#ctx;
        if (fill)
            ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(point.x, point.y, width, 0, 2 * Math.PI);
        ctx.fill();
    }
}
