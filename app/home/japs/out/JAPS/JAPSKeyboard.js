import ChildrenSet from './ChildrenBox.js';
class BasicListener {
}
export default class JAPSUpdater extends ChildrenSet {
    onkey(key) {
        this.children.forEach(child => {
            child.onkey(key);
        });
    }
}
