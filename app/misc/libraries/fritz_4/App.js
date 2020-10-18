import Timer from './Timer.js'
import Entity from './Entity.js'

export class Layer extends Entity {
  constructor() {
    super()
    this.children = new Map()
    this.childrenTags = new Map()
  }

  addChild(ChildClass, ...args) {
    const child = new ChildClass(...args, this)
    child.master = this

    if (child.register)
      child.register(child.events.getRegister(child), this)

    child.traits.forEach(trait => {
      if (trait.register) {
        trait.register(child.events.getRegister(trait), child, this)
      }
    })

    if (!this.children.get(ChildClass)) {
      this.children.set(ChildClass, new Set([child]))
    } else {
      this.children.get(ChildClass).add(child)
    }

    const tags = ['all'].concat(ChildClass.tags || [])
    tags.forEach(tag => {
      if (!this.childrenTags.get(tag)) {
        this.childrenTags.set(tag, new Set([child]))
      } else {
        this.childrenTags.get(tag).add(child)
      }
    })

    return child
  }

  removeChild(child) {
    const ChildClass = children.constructor

    return this.children.get(ChildClass)?.remove(child)
  }
}

export default class App extends Layer {
  constructor() {
    super()

    window.addEventListener('load', () => {
      this.register(this.events.listen.bind(this.events))

      this.traits.forEach(trait => {
        if (trait.register)
          trait.register(this.events.listen.bind(this.events))
      })

      this.timer = new Timer(60, () => {
        this.events.fire('update')
        this.events.fire('render')
      })
    })
  }
}
/*
  new App

  register App => register App traits
  register Children => register Child traits

*/
