/*
  Base class for every layer type
  Has cameraSettings
  Has children
  Has getsprite
*/

class Layer extends Frame {
  constructor(cameraMode = {}) {
    super(0, 0, 100, 100)
    this.useHTML = this.constructor.useHTML

    this.scale = [1, 1]

    // referenze for resizing
    this.baseSize = this.copySize()
    this.baseScale = this.copyScale()
    this.baseScale.listen(() => this.runUpdateSize())

    // this.pos.listen(() => {this.changed = this.changed || !this.parentLayer.useHTML; console.log(this.changed);})
    this.pos.listen(() => this.changed = this.changed || !this.parentLayer.useHTML)
    this.scale.listen(() => this.changed = this.changed || !this.parentLayer.useHTML)

    this.children = new ElementsHandler()

    const {from} = cameraMode

    if (!this.useHTML) {
      if (typeof from == 'string') {
        const canvas = document.getElementById(from)
        this.sprite = new RenderContext(this, new Context(canvas))
      } else {
        const canvas = document.createElement('canvas')
        this.sprite = new RenderContext(this, new Context(canvas))
      }

      this.size.listen(x => {
        this.sprite.canvas.width = x
        this.sprite.topContext.restore()
      }, y => {
        this.sprite.canvas.height = y
        this.sprite.topContext.restore()
      })
    } else {
      if (typeof from == 'string') {
        this.container = document.getElementById(from)
      } else {
        this.container = document.createElement('div')
      }
    }

    this.cameraMode = addDefaultOptions(cameraMode, {ratio: 16 / 9, size: 'fill'})
    this.align(cameraMode.align || 'top-left')
    this.translate(cameraMode.translate || 'top-left')
  }

  align(align) {
    this.alignMode = getAlign(align)
  }

  resize(parentW, parentH) {
    console.assert(parentW && parentH, `Invalid parent size! ${parentW}, ${parentH}`)
    this.setBaseSize(parentW, parentH)
    this.runUpdateSize()
  }

  updateSize() {
    const [parentW, parentH] = this.baseSize
    const {size, ratio} = this.cameraMode


    if (Array.isArray(size)) {
      this.scale = this.baseScale
      this.setSize(size[0], size[1])
    } else {
      let newW = parentW, newH = parentH, newSx = this.bsx, newSy = this.bsy

      if (size == 'fit') {
        if (parentH * ratio <= parentW) {
          // too wide
          newW = parentH * ratio
        } else {
          // to tall
          newH = parentW / ratio
        }
      }

      this.setScale(newSx, newSy)
      this.setBaseSize(newW, newH)

      this.setSize(...ceil(newW / newSx, newH / newSy))
    }

    const [xAlign, yAlign] = this.alignMode
    this.setPos(ceil((parentW - this.w * this.sx) * xAlign), ceil((parentH - this.h * this.sy) * yAlign))
  }

  updateSizeBubble() {
    this.children.forEach(child => {
      if (child instanceof Layer) {
        child.runResize(...this.size)
      }
    })
  }

  addChild(child, layer) {
    this.children.add(child, child.constructor.name)

    child.parentLayer = this
    this.changed = true

    this.runOnChildAdded(child)
  }

  onChildAddedCapture(child) {
    if (child instanceof Layer) {
      child.runResize(...this.size)
    }

    if (this.useHTML) {
      if (child.useHTML) {
        this.container.appendChild(child.container)
      } else {
        this.container.appendChild(child.sprite.canvas)
      }
    }
  }

  removeChild(child) {
    this.children.remove(child, child.constructor.name)
    this.changed = true
  }

  clearChildren() {
    this.children.clear()
    this.changed = true
  }

  updateCapture() {
    this.children.forEach(child => {
      if (child.runUpdate() || child.changed) {
        this.changed = true
      }
    })
  }

  updateBubble() {
    if (this.parentLayer.useHTML && (this.hasChangedPos || this.changedScale)) {
      // if both pos and scale have changed, the above statement cuts short
      // at the || and scale is't staganted
      this.stagnateScale()

      const {style} = this.useHTML ? this.container : this.sprite.canvas
      const {scale, pos} = this
      style.transform = `matrix(${scale.x}, 0, 0, ${scale.y}, ${pos.x}, ${pos.y})`
    }

    return this.changed
  }

  fixedUpdateCapture() {
    this.children.forEach(child => {
      child.runFixedUpdate()
    })
  }

  renderBubble(parent) {
    if (this.useHTML) {
      this.children.forEach(child => {
        if (child.changed) {
          child.runRender(this)
          child.changed = false
        }
      })
    } else {
      this.children.forEach(child => {
        // if something changed, then all must change
        const sprite = child.runRender(this)
        if (sprite) {
          if (child instanceof Layer) {
            console.log(child.x, child.y, child.w * child.sx, child.h * child.sy);
            this.image(sprite, child.x, child.y, child.w * child.sx, child.h * child.sy)
          } else {
            this.image(sprite, child.x, child.y, child.w, child.h)
          }
        } else if (sprite !== false) {
          throw new Error('Illegal sprite return')
        }

        child.changed = false
      })

      return this.sprite.canvas
    }
  }
}

addVec2(Layer, 'scale', 'sx', 'sy')
addVec2(Layer, 'baseSize', 'bw', 'bh')
addVec2(Layer, 'baseScale', 'bsx', 'bsy')

createMiddleware(Layer, 'render')
createMiddleware(Layer, 'resize')
createMiddleware(Layer, 'updateSize')
createMiddleware(Layer, 'onChildAdded')
createMiddleware(Layer, 'onChildRemoved')

Object.defineProperty(Layer.prototype, 'parentLayer', {
  get: function() {
    console.error(this);
    throw new Error('Broken layer chain!!')
  },
  set: function(value) {
    Object.defineProperty(this, 'parentLayer', {value})
  }
})
