import Timer from './Timer.js'

const canvas = document.getElementById('screenCanvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

let app
export default class App {
  constructor() {
    app = this
    this.timer = new Timer(60, () => this.render(ctx), false)

    this.children = new Map()
  }

  addChild(ChildClass, ...args) {
    const child = new ChildClass(this, ...args)
    child.master = this

    if (!this.children.get(ChildClass)) {
      this.children.set(ChildClass, new Set([child]))
    } else {
      this.children.get(ChildClass).add(child)
    }

    return child
  }

  removeChild(child) {
    const ChildClass = children.constructor

    return this.children.get(ChildClass)?.remove(child)
  }
}

window.addEventListener('load', () => {
  app.init(canvas)
  app.timer.start()
})
