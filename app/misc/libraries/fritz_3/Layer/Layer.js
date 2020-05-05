/*
  Base class for every layer type
  Has cameraSettings
  Has children
  Has getsprite
*/

class Layer extends Frame {
  constructor(cameraMode = {}) {
    super(0, 0, 100, 100)

    this.mult = [1, 1]
    this.children = new ElementsHandler()

    const {from} = cameraMode

    if (!this.constructor.useHTML) {
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

  updateCameraMode(parent, width, height) {
    const {size, ratio} = this.cameraMode

    // console.log(parent, this, width, height, size);
    if (size == 'fit') {
      if (height * ratio <= width) {
        const newWidth = Math.ceil(height * ratio)
        this.setSize(newWidth, height)
        this.setPos((width - newWidth) / 2 | 0, 0)
      } else {
        const newHeight = Math.ceil(width / ratio)
        this.setSize(width, newHeight)
        this.setPos(0, (height - newHeight) / 2 | 0)
      }
    } else if (size == 'fill') {
      this.setSize(width, height)
    } else if (Array.isArray(size)){
      this.setSize(width * size[0], height * size[1])
    }

    // console.log(this.children);
    this.children.forEach(child => {
      if (child instanceof Layer) {
        child.updateCameraMode(this, this.width, this.height)
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
      child.updateCameraMode(this, this.width, this.height)
    }

    if (this.constructor.useHTML) {
      if (child.constructor.useHTML) {
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
      child.runUpdate()
    })
  }

  fixedUpdateCapture() {
    this.children.forEach(child => {
      child.runFixedUpdate()
    })
  }

  render() {
    this.children.forEach(child => {
      if (child.changed) {
        child.runRender(this)
      }
    })
  }
}

addVec2(Layer, 'mult', 'xm', 'ym')
createMiddleware(Layer, 'render')
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
