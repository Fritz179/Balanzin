export default class Sprite {
  constructor(master, w, h) {
    this.canvas = master.canvas = document.createElement('canvas')
    this.canvas.width = w || master.width
    this.canvas.height = h || master.height

    this.canvas.id = master.constructor.name.toLowerCase()

    this.ctx = master.ctx = master.canvas.getContext('2d')

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
