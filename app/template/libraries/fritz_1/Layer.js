class Layer extends Master {
  constructor() {
    super()

    this.graphic = createGraphics(100, 100)
    this.resizedGraphic = true;

    this.camera = null
    this._status = null
  }

  get w() { return this.graphic ? this.graphic.width : 0 }
  get h() { return this.graphic ? this.graphic.height : 0 }

  set w(w) { return this.setSize(w, this.h) }
  set h(h) { return this.setSize(this.w, h) }

  setSize(w, h) {
    if (this.graphic && (this.graphic.width != w || this.graphic.height != h)) {
      this.graphic.remove()
      this.graphic = createGraphics(w, h)

      if (this.camera) {
        if (this.camera._toSmooth) this.graphic.smooth()
        else this.graphic.noSmooth()
      }

      this.resizedGraphic = true;
    }
    return this
  }

  getSprite(getRealX, getRealY, getMouseX, getMouseY) {
    this.update(getRealX, getRealY, getMouseX, getMouseY)
    return this.graphic
  }

  update() {
    throw new Error(`No update in layer: ${this.constructor.name}`)
  }
}

class SpriteLayer extends Layer {
  constructor(parent) {
    super()

    this.ecs = parent._status.ecs
  }

  update(getMouseX, getMouseY, getPmouseX, getPmouseY) {
    this.center = this.camera.center

    const {x1, y1} = this
    const {entities} = this.ecs
    const {graphic} = this

    graphic.clear()
    graphic.noFill()
    graphic.strokeWeight(1)
    graphic.stroke(255, 0, 0)

    entities.forEach(e => {
      e._mouseX = () => getMouseX() - e.x1
      e._mouseY = () => getMouseY() - e.y1
      e._pmouseX = () => getPmouseX() - e.x1
      e._pmouseY = () => getPmouseY() - e.y1

      if (p5.prototype.collideRectRect(this, e)) {
        //get the sprite and pos of the entity
        let sprite = e.getSprite(getMouseX, getMouseY, getPmouseX, getPmouseY), x = e.x3 - x1, y = e.y3 - y1
        //if a sprite is returned, draw it else if false is returned don't draw
        //but if nothing is retunred, throw an error
        if (sprite) graphic.rImage(sprite, x + (sprite.deltaX || 0), y + (sprite.deltaY || 0))
        else if (sprite !== false) {
          console.error('Illegal return of getSprite: ', e);
          throw new Error('If no sprite must be drawn, return false')
        }

        //if debugEnabled draw the hitbox
        if (debugEnabled) {
          graphic.rRect(e.x1 - x1, e.y1 - y1, e.w1 - 1, e.h1 - 1)
          // graphic.rLine(e.x - x1, e.y - y1, e.x2 - 1 - x1, e.y2 - 1 - y1)
          // graphic.rLine(e.x - x1, e.y2 - 1 - y1, e.x2 - 1 - x1, e.y - y1)
        }
      }
    })
  }
}

class TileLayer extends Layer {
  constructor(parent) {
    super()

    this.maps = parent._status
  }

  update() {
    const {camera} = this
    const {chunkWidth, chunkHeight, tileWidth} = this.maps
    const w = chunkWidth * tileWidth, h = chunkHeight * tileWidth

    this.setPos(camera.x, camera.y)
    this.graphic.clear()
    this.graphic.stroke(0, 0, 255)
    this.graphic.strokeWeight(1)
    this.graphic.noFill()
    this.graphic.noSmooth()

    for (let x in this.maps.chunks) {
      const col = this.maps.chunks[x]

      for (let y in col) {
        this.graphic.rImage(col[y].graphic, x * w - camera.x, y * h - camera.y)
        if (debugEnabled) this.graphic.rRect(x * w - camera.x, y * h - camera.y, w, h)
      }
    }
  }
}

class BackgroundLayer extends Layer {
  constructor(img) {
    super()

    this.img = img
  }

  update() {
    if (this.resizedGraphic) {
      this.resizedGraphic = false

      if (this.camera._toSmooth) this.graphic.smooth()
      else this.graphic.noSmooth()
      this.redraw()
    }
  }

  redraw() {
    this.graphic.rImage(this.img, 0, 0, this.graphic.width, this.graphic.height)
  }

  setImg(img) {
    this.img = img
    this.setSize(img.width, img.height)
    this.redraw()
  }
}
