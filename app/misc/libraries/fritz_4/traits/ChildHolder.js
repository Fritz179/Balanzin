export default class ChildHolder extends Map {
  constructor(master) {
    super()

    master.children = this

    master.events.listen('update', () => {
      this.forEach(set => {
        set.forEach(child => {
          child.events.fire('update')
        })
      })
    })

    master.events.listen('render', () => {
      this.forEach(set => {
        set.forEach(child => {
          child.events.fire('render', master.ctx)
        })
      })
    })

    this.master = master
  }

  add(ChildClass, ...args) {
    const child = new ChildClass(...args, this.master)
    child.master = this.master

    child.events.fire('register', child.events.getRegister(child), this.master)

    if (!this.get(ChildClass)) {
      this.set(ChildClass, new Set([child]))
    } else {
      this.get(ChildClass).add(child)
    }

    this.master.events.fire('child', child)

    return child
  }

  remove(child) {
    const ChildClass = children.constructor

    console.log('nope');
    return this.get(ChildClass)?.remove(child)
  }
}
