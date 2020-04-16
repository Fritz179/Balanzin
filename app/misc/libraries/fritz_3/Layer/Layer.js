class Layer extends Frame {
  constructor(cameraMode) {
    super(0, 0, 100, 100)

    this.mult = [1, 1]

    this.children = new Set()
    this.children.types = []

    this.cameraMode = {}
    if (cameraMode) {
      this.setCameraMode(cameraMode)
    }
  }

  // renderCapture(parentSprite) {
  //   if (!this.buffer) {
  //     this.parentSprite = parentSprite
  //   }
  // }

  setCameraMode({mode, align = 'top-left', from, ratio = 16 / 9, size = 'fit', baseWidth}) {
    this.cameraMode.size = size
    this.cameraMode.from = from
    this.cameraMode.ratio = ratio
    this.cameraMode.baseWidth = baseWidth

    if (from) {
      if (typeof from == 'string') {
        const canvas = document.getElementById(from)
        this.sprite = new RenderContext(this, new Context(canvas))
      } else if (mode == 'overlay'){
        this.sprite = new RenderContext(this, from.sprite)
      } else {
        const canvas = document.createElement('canvas')
        this.sprite = new RenderContext(this, new Context(canvas))
      }
    } else if (mode != 'custom') {
      if (!Array.isArray(size))
        throw new Error(`For {mode: 'fixed'} the {size: [100, 100]} is required!`)


      if (mode == 'overlay'){
        this.sprite = new RenderContext(this)
      } else {
        const canvas = document.createElement('canvas')
        this.sprite = new RenderContext(this, new Context(canvas))
      }
    }

    const xTable = {left: 0, right: 1, center: 0.5}
    const yTable = {top: 0, bottom: 1, center: 0.5}

    if (align == 'center') align = 'center-center'
    else if (align == 'top') align = 'top-center'
    else if (align == 'right') align = 'center-right'
    else if (align == 'bottom') align = 'bottom-center'
    else if (align == 'left') align = 'center-left'

    this.cameraMode.xAlign = xTable[align.split('-')[1]] || 0
    this.cameraMode.yAlign = yTable[align.split('-')[0]] || 0

    this.updateCameraMode()
  }

  updateCameraMode() {
    const {from, size, ratio, baseWidth} = this.cameraMode
    console.log(this, from);

    if (from) {
      let width, height

      if (typeof from == 'string') {
        [width, height] = [window.innerWidth, window.innerHeight]
        this.sprite.to.canvas.width = width
        this.sprite.to.canvas.height = height
      } else {
        [width, height] = [from.w, from.h]
      }

      console.log(width, height, size);
      if (size == 'fit') {
        if (height * ratio <= width) {
          this.setSize(height * ratio, height)
        } else {
          this.setSize(width, width / ratio)
        }
      } else if (size == 'fill') {
        this.setSize(width, height)
      } else if (Array.isArray(size)){
        this.setSize(width * size[0], height * size[1])
      }

      if (baseWidth) {
        this.setMult(this.width / baseWidth)
      }
    }
  }

  addChild(child, layer) {
    if (this.children.has(child)) {
      console.warn('Layer already has child: ', child)
    } else {
      child.parentLayer = this
      this.children.add(child)
      this.changed = true

      const {name} = child.constructor

      if (!this.children[name]) {
        this.children[name] = new Set([child])
      } else {
        this.children[name].add(child)
      }

      if (!this.children.types.includes(name)) {
        this.children.types.push(name)
      }

      this.onChildrenAdded(child)

      return this
    }
  }

  onChildrenAdded() {

  }

  removeChild(child) {
    if (!this.children.delete(child)) {
      console.warn('Cannot remove unexisting child: ', child);
    } else {
      this.changed = true

      this.children[child.constructor.name].delete(child)
    }
  }

  onChildrenRemoved() {

  }

  clearChildren() {
    this.children.forEach(child => {
      this.removeChild(child)
    })
  }

  setChildren(children) {
    this.clearChildren()

    if (Array.isArray(children)) {
      children.forEach(child => {
        this.addChild(child)
      })
    } else {
      this.addChild(children)
    }
  }

  forEachChild(fun) {
    let i = 0
    this.children.forEach((value, key, set) => {
      fun(key, i++, set)
    })
  }

  onResize({w, h}) {
    this.updateCameraMode()

    this.forEachChild(child => {
      child.resize(this.w, this.h)
    })

    this.onResizeBubble()
  }
}

addVec2(Layer, 'mult', 'xm', 'ym')

Object.defineProperty(Layer.prototype, 'parentLayer', {
  get: function() {
    console.error(this);
    throw new Error('Broken layer chain!!')
  },
  set: function(value) {
    Object.defineProperty(this, 'parentLayer', {value})
  }
})
