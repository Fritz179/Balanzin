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

      this.size.bind(this.sprite.canvas, 'width', 'height')
    } else {
      if (typeof from == 'string') {
        this.container = document.getElementById(from)
      } else {
        this.container = document.createElement('div')
      }
    }

    if (!cameraMode.align) cameraMode.align = 'top-left'
    this.setCameraMode(cameraMode)
  }

  setCameraMode({from, align, ratio = 16 / 9, size = 'fill'}) {
    console.log('??');
    this.cameraMode = {size, ratio, from}

    if (align) {
      this.setAlignMode(align)
    }
  }

  setAlignMode(align) {
    const xTable = {left: 0, right: 1, center: 0.5}
    const yTable = {top: 0, bottom: 1, center: 0.5}

    if (align == 'center') align = 'center-center'
    else if (align == 'top') align = 'top-center'
    else if (align == 'right') align = 'center-right'
    else if (align == 'bottom') align = 'bottom-center'
    else if (align == 'left') align = 'center-left'

    this.cameraMode.xAlign = xTable[align.split('-')[1]] || 0
    this.cameraMode.yAlign = yTable[align.split('-')[0]] || 0
  }

  updateCameraMode(parent, parentW, parentH, parentSx, parentSy) {
    console.assert(parentW && parentH, `Invalid parent size! ${parentW}, ${parentH}`)

    const {size, ratio} = this.cameraMode
    let newW = parentW, newH = parentH, newSx = this.bsx, newSy = this.bsy

    if (size == 'fit') {
      if (parentH * ratio <= parentW) {
        // too wide
        newW = parentH * ratio
      } else {
        // to tall
        newH = parentW / ratio
      }
      this.setPos(floor((parentW - newW) / 2), floor((parentH - newH) / 2))
    }

    this.setScale(newSx, newSy)
    // this.sprite.topContext.save()
    this.setSize(...ceil(newW / newSx, newH / newSy))
    // this.sprite.topContext.restore()
  }

  updateCameraModeBubble() {
    this.children.forEach(child => {
      if (child instanceof Layer) {
        child.runUpdateCameraMode(this, ...this.size, ...this.scale)
      }
    })

    this.changed = true
  }

  addChild(child, layer) {
    this.children.add(child, child.constructor.name)

    child.parentLayer = this
    this.changed = true

    this.runOnChildAdded(child)
  }

  onChildAddedCapture(child) {
    if (child instanceof Layer) {
      child.runUpdateCameraMode(this, ...this.size, ...this.scale)
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

    return this.changed || this.changedPos || this.changedScale
  }

  fixedUpdateCapture() {
    this.children.forEach(child => {
      child.runFixedUpdate()
    })
  }

  renderCapture(parent) {
    if (parent.useHTML && (this.hasChangedPos || this.changedScale)) {
      // if both pos and scale have changed, the above statement cuts short
      // at the || and scale is't staganted
      this.stagnateScale()

      const {style} = this.useHTML ? this.container : this.sprite.canvas
      const {scale, pos} = this
      style.transform = `matrix(${scale.x}, 0, 0, ${scale.y}, ${pos.x}, ${pos.y})`
    }

    if (this.useHTML) {
      this.children.forEach(child => {
        if (child.changed) {
          child.runRender(this)
          child.changed = false
        }
      })
    } else {
      this.children.forEach(child => {
        if (child.changed) {
          const sprite = child.runRender(this)

          if (sprite) {
            this.image(sprite, child.x, child.y, child.w * child.sx, child.h * child.sy)
          }

          child.changed = false
        }
      })

      return this.sprite.canvas
    }
  }
}

addVec2(Layer, 'scale', 'sx', 'sy')
addVec2(Layer, 'baseSize', 'bw', 'bh')
addVec2(Layer, 'baseScale', 'bsx', 'bsy')

createMiddleware(Layer, 'render')
createMiddleware(Layer, 'onChildAdded')
createMiddleware(Layer, 'onChildRemoved')
createMiddleware(Layer, 'updateCameraMode')

Object.defineProperty(Layer.prototype, 'parentLayer', {
  get: function() {
    console.error(this);
    throw new Error('Broken layer chain!!')
  },
  set: function(value) {
    Object.defineProperty(this, 'parentLayer', {value})
  }
})
