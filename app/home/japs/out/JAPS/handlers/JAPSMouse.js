import ChildrenSet from './ChildrenBox.js';
import Vec2 from '../math/Vec2.js';
class BasicListener {
}
export default class JAPSMouse extends ChildrenSet {
    position = new Vec2(0, 0);
    click(e) {
        this.position.set(e.x, e.y);
        this.children.forEach(child => {
            if (child.click)
                child.click(e.x, e.y, e);
        });
    }
    move(e) {
        this.position.set(e.x, e.y);
        this.children.forEach(child => {
            if (child.move)
                child.move(e.x, e.y, e);
        });
    }
}
