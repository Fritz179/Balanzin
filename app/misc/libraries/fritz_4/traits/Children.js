export default class Children extends Set {
  constructor(master) {
    super()

    master.children = this

    master.events.listen('update', () => {
      this.forEach(child => {
        child.events.fire('update')
      })
    })

    master.events.listen('render', () => {
      this.forEach(child => {
        child.events.fire('render', master.ctx)
      })
    })

    this.master = master
  }

  add(ChildClass, ...args) {
    const child = new ChildClass(...args, this.master)
    child.master = this.master

    this.addLive(child, ChildClass)

    return child
  }

  addLive(child, ChildClass) {
    child.events.fire('register', child.events.getRegister(child), this.master)

    super.add(child)

    this.master.events.fire('addChild', child, ChildClass)
  }

  remove(child) {
    const ChildClass = child.constructor

    this.master.events.fire('removeChild', child, ChildClass)
    return this.delete(child)
  }
}

export class ChildClasses extends Map {
  constructor(master) {
    super()
    
    master.childCLasses = this

    master.events.listen('addChild', this.addChild.bind(this))
    master.events.listen('removeChild', this.addChild.bind(this))

    this.master = master
  }

  add(child, ChildClass) {
    if (!this.get(ChildClass)) {
      this.set(ChildClass, new Set([child]))
    } else {
      this.get(ChildClass).add(child)
    }
  }

  remove(child, ChildClass) {
    return this.get(ChildClass)?.remove(child)
  }
}
