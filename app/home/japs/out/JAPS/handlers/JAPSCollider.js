import ChildrenSet from './ChildrenBox.js';
import { Shape } from '../math/Shape.js';
class BasicCollider extends Shape {
}
class BasicSolver {
}
export default class JAPSCollider extends ChildrenSet {
    collide() {
        const children = [...this.children];
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // child.yv += 1
            //
            // child.x += child.xv
            // child.y += child.yv
            //
            // if (child.y2 > this.master.h) {
            //   child.y2 = this.master.h
            //   child.yv = 0
            // }
            for (let j = i + 1; j < children.length; j++) {
                const other = children[j];
                if (child.bb.intersects(other.bb)) {
                    child.onCollision(other.bb, () => { });
                    other.onCollision(child.bb, () => { });
                }
            }
        }
    }
}
