export default class spriteSheet {
  constructor(image, w, h) {
    this.image = image
    this.w = w
    this.h = h
    this.tiles = new Map()
    this.animation = new Map()
  }

  defineAnimation(name, animation) {
    this.animation.set(name, animation)
  }

  define(name, x, y, width, height) {
    const buffers = [false, true].map(flip => {

      let buffer = document.createElement('canvas')
      buffer.width = width
      buffer.height = height
      const context = buffer.getContext('2d')

      if (flip) {
        context.scale(-1, 1)
        context.translate(-width + 2, 0)
      }
      
      context.drawImage(this.image, x, y, width, height, 0, 0, width, height)
      return buffer
    })

    this.tiles.set(name, buffers)
  }

  defineTile(name, x, y) {
    this.define(name, x * this.w, y * this.h, this.w, this.h)
  }

  drawAnimation(name, context, x, y, dist) {
    const animation = this.animation.get(name)
    this.drawTile(animation(dist), context, x, y)
  }

  draw(name, context, x, y, flip = 0) {
    context.drawImage(this.tiles.get(name)[flip], x, y)
  }

  drawTile(name, context, x, y) {
    this.draw(name, context, x * 16, y * 16)
  }
}
