/*
  Base class for every layer type
  Has cameraSettings
  Has children
  Has getsprite

  container is first node
  childContainer is the container where childs are inserted
  canvas not required
*/

class Layer extends Frame {
  constructor(cameraMode = {}, useHTML) {
    super(0, 0, 100, 100)
    this.useHTML = useHTML

    // referenze for resizing
    this.basePos = this.pos
    this.baseSize = this.size
    this.baseScale = this.scale
    this.baseScale.listen(() => this.runUpdateSize())

    this.children = new ElementsHandler()

    const {from} = cameraMode

    if (!useHTML) {
      this.container = document.createElement('div')
      this.childContainer = document.createElement('div')

      if (typeof from == 'string') {
        this.canvas = document.getElementById(from)
      } else {
        this.canvas = document.createElement('canvas')
      }
      this.sprite = new RenderContext(this, new Context(this.canvas))

      this.container.appendChild(this.childContainer)
      this.container.appendChild(this.canvas)
    } else {
      if (typeof from == 'string') {
        this.container = document.getElementById(from)
      } else {
        this.container = document.createElement('div')
      }

      this.childContainer = this.container
    }

    this.cameraMode = addDefaultOptions(cameraMode, {ratio: 16 / 9, size: 'fill'})
    this.align(cameraMode.align || 'top-left')
    this.translate(cameraMode.translate || 'top-left')
  }

  align(align) {
    const [x, y] = this.alignMode = getAlign(align)
    const {style} = this.container

    style.transformOrigin = `${x * 100}% ${y * 100}%`

    if (this.canvas) {
      this.canvas.style.transformOrigin = style.transformOrigin
    }
  }

  resize(parentW, parentH) {
    console.assert(parentW && parentH, `Invalid parent size! ${parentW}, ${parentH}`)
    this.setBaseSize(parentW, parentH)
    this.runUpdateSize()

    this.children.forEach(child => {
      if (child instanceof Layer) {
        child.runResize(...this.baseSize)
      }
    })
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
      } else if (size == 'none') {
        newW = newH = 0
      }

      this.setScale(newSx, newSy)
      this.setBaseSize(newW, newH)

      this.setSize(...ceil(newW / newSx, newH / newSy))
    }

    const [xAlign, yAlign] = this.alignMode
    // this.setPos(ceil((parentW - this.w * this.sx) * xAlign), ceil((parentH - this.h * this.sy) * yAlign))
    // this.setBasePos(ceil((parentW * xAlign - this.w * this.sx * xAlign)), ceil((parentH * yAlign - this.h * this.sy * yAlign)))
    this.setBasePos(ceil((parentW * xAlign - this.w * xAlign)), ceil((parentH * yAlign - this.h * yAlign)))
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

    this.childContainer.appendChild(child.container)
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
    if (this.changedBasePos || this.changedPos || this.changedScale) {
      // cannot use hasChange because if multiple have changed,
      // the above statement cuts short and not everything is stagnated

      // set transform of container
      const {scale, pos, basePos} = this
      this.childContainer.style.transform = `matrix(${scale.x}, 0, 0, ${scale.y},
        ${Math.floor(pos.x + basePos.x)}, ${Math.floor(pos.y + basePos.y)})`

      if (this.canvas && (this.changedBasePos || this.changedScale)) {
        const {scale, basePos} = this

        this.canvas.style.transform = `matrix(${scale.x}, 0, 0, ${scale.y},
          ${Math.floor(basePos.x)}, ${Math.floor(basePos.y)})`
      }

      this.stagnateBasePos()
      this.stagnateScale()
      this.stagnatePos()
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
        if (child instanceof Layer && !child.changed) return
        // if something changed, then all must change
        const sprite = child.runRender(this)
        if (sprite) {
          console.log(sprite);
          if (child instanceof Layer) {
            this.image(sprite, child.x, child.y, child.w * child.sx, child.h * child.sy)
          } else {
            this.image(sprite, child.x, child.y, child.w, child.h)
          }
        } else if (sprite !== false) {
          throw new Error('Illegal sprite return')
        }

        child.changed = false
      })
      // return this.sprite.canvas
    }
    return false
  }
}

addVec2(Layer, 'basePos', 'bx', 'by')
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
