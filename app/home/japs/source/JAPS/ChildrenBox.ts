class BasicMaster {

}

type Constructor = new (...args: any[]) => {};
export function ChildrenSetMixin<ChildT, MasterT = BasicMaster>(Base: Constructor) {
  return class ChildrenSet extends Base {
    children = new Set<ChildT>()
    master: MasterT

    constructor(master: MasterT, ...args: any[]) {
      super(...args)

      this.master = master
    }

    register(entity: ChildT, registering: boolean) {
      if (registering) {
        this.children.add(entity)
        return
      }

      this.children.delete(entity)
    }
  }
}

export default class ChildrenSet<ChildT, MasterT = BasicMaster> {
  children = new Set<ChildT>()
  master: MasterT

  constructor(master: MasterT) {
    this.master = master
  }

  register(entity: ChildT, registering: boolean) {
    if (registering) {
      this.children.add(entity)
      return
    }

    this.children.delete(entity)
  }
}

export class ChildrenMap<KeyT, ValueT, MasterT = BasicMaster> {
  children = new Map<KeyT, ValueT>()
  master: MasterT

  constructor(master: MasterT) {
    this.master = master
  }

  register(key: KeyT, value: ValueT, registering: boolean) {
    if (registering) {
      this.children.set(key, value)
      return
    }

    this.children.delete(key)
  }
}