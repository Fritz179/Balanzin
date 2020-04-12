const DEFAULT_TEXTURE = null

class Frame extends Block {
  constructor(x, y, w, h) {
    super(x, y, w, h)
    this.prev = new prevVec(x, y)
    this.mult = new multVec(1, 1)

    this._wasOnClick = false
    this._hovered = false
    this.sprite = null
    this.layer = null
    this.changed = true

    this.triggerBox = new TriggerBox(this)

    createMiddleware(this, 'update')
    createMiddleware(this, 'fixedUpdate')
    createMiddleware(this, 'getSprite')
  }

  fixedUpdateBubble() {
    if (this.x != this.px || this.y != this.py) {
      this.changed = true
      this.px = this.x
      this.py = this.y
    }
  }

  setTrigger(...args) {
    this.triggerBox.set(...args)
  }

  onKey(key) { }
  onKeyBubble(key) { }
  onKeyUp(key) { }
  onKeyUpBubble(key) { }

  onDrag(x, y, dx, dy) { }
  onDragBubble(x, y, dx, dy) { }
  onWheel(dir) { }
  onWheelBubble(dir) { }

  onHover() { }
  onHoverBubble() { }
  onUnhover() { }
  onUnhoverBubble() { }
};

['Mouse', 'Click'].forEach(name => {
  ['', 'Drag', 'Up', 'Released'].forEach(action => {
    ['', 'Left', 'Middle', 'Right'].forEach(dir => {
      Frame.prototype[`on${dir}${name}${action}`] = () => { }
      Frame.prototype[`on${dir}${name}${action}Bubble`] = () => { }
    })
  })
})

const prevVec = addVec2(Frame, 'prev', 'px', 'py')
const multVec = addVec2(Frame, 'mult', 'xm', 'ym')
