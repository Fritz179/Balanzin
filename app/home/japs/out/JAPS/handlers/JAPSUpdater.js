import ChildrenSet from './ChildrenBox.js';
class BasicUpdater {
}
export default class JAPSUpdater extends ChildrenSet {
    updateStart() {
        this.children.forEach(child => {
            if (child.updateStart)
                child.updateStart();
        });
    }
    update() {
        this.children.forEach(child => {
            if (child.update)
                child.update();
        });
    }
    updateEnd() {
        this.children.forEach(child => {
            if (child.updateEnd)
                child.updateEnd();
        });
    }
}
