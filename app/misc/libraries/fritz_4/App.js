import Timer from './Timer.js'
import Entity from './Entity.js'
import Sprite from './Sprite.js'

export class Layer extends Entity {
  constructor(id) {
    super()
    this.children = new Map()
    // this.childrenTags = new Map()

    if (typeof id == 'string') {
      this.div = document.getElementById(id)
    } else {
      this.div = document.createElement('div')
      this.events.listen('register', (listen, app, parent) => {
        id.div.appendChild(this.div)
      })
    }

    this.events.listen('update', () => {
      this.children.forEach(set => {
        set.forEach(child => {
          child.events.fire('update')
        })
      })
    })

    this.events.listen('render', () => {
      this.children.forEach(set => {
        set.forEach(child => {
          child.events.fire('render', this.ctx)
        })
      })
    })
  }

  addChild(ChildClass, ...args) {
    const child = new ChildClass(...args, this)
    child.master = this

    child.events.fire('register', child.events.getRegister(child), this)

    if (!this.children.get(ChildClass)) {
      this.children.set(ChildClass, new Set([child]))
    } else {
      this.children.get(ChildClass).add(child)
    }

    this.events.fire('child', child)

    return child
  }

  removeChild(child) {
    const ChildClass = children.constructor

    console.log('nope');
    return this.children.get(ChildClass)?.remove(child)
  }
}

export default class App extends Layer {
  constructor(id = 'screen') {
    super(id)

    window.addEventListener('load', () => {
      this.events.fire('register', this.events.listen.bind(this.events))

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
  register Children => register Children traits

*/
