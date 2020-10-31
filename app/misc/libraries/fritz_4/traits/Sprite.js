export class Canvas {
  constructor(w, h, id) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = w || 100
    this.canvas.height = h || 100
    this.ctx = this.canvas.getContext('2d')

    if (id) this.canvas.id = id
  }
}

export default class Sprite extends Canvas {
  constructor(master, w, h, id) {
    super(w, h, id || master.constructor.name.toLowerCase())

    master.canvas = this.canvas
    master.ctx = this.ctx

    if (!w && !h)
      master.events.listen('render', () => this.updateSize())

    if (master.div)
      master.div.appendChild(this.canvas)
  }

  updateSize() {
    const {canvas, x, y, w, h} = this.master

    if (canvas.width != w) canvas.width = w
    if (canvas.height != h) canvas.height = h
  }
}
