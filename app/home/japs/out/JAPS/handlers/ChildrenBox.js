class BasicMaster {
}
export function ChildrenSetMixin(Base) {
    return class ChildrenSet extends Base {
        children = new Set();
        master;
        constructor(master, ...args) {
            super(...args);
            this.master = master;
        }
        register(entity, registering) {
            if (registering) {
                this.children.add(entity);
                return;
            }
            this.children.delete(entity);
        }
    };
}
export default class ChildrenSet {
    children = new Set();
    master;
    constructor(master) {
        this.master = master;
    }
    register(entity, registering) {
        if (registering) {
            this.children.add(entity);
            return;
        }
        this.children.delete(entity);
    }
}
export class ChildrenMap {
    children = new Map();
    master;
    constructor(master) {
        this.master = master;
    }
    register(key, value, registering) {
        if (registering) {
            this.children.set(key, value);
            return;
        }
        this.children.delete(key);
    }
}
