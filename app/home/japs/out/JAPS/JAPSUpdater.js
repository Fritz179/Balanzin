import ChildrenSet from './ChildrenBox.js';
class BasicUpdater {
}
export default class JAPSUpdater extends ChildrenSet {
    updateStart() {
        this.children.forEach(child => {
            child.updateStart();
        });
    }
    updateEnd() {
        this.children.forEach(child => {
            child.updateEnd();
        });
    }
}
