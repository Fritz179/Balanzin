class Frame extends Block {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this._wasOnClick = false  // for onMouse and onClick distinction
    this._hovered = false     // for hovered

    this.changed = true
  }

  fixedUpdateBubble() {
    // if (this.x != this.px || this.y != this.py) {
    //   this.changed = true
    //   this.prevPos.set(this.pos)
    // }
  }

  noSmooth() {
    this.sprite.smooth(false)
    return this
  }

  smooth() {
    this.sprite.smooth(true)
    return this
  }

  fill(...args) {
    this.sprite.fill(getColor(args))
    return this
  }

  noFill() {
    this.sprite.fill(false)
    return this
  }

  stroke(...args) {
    this.sprite.stroke(getColor(args))
    return this
  }

  noStroke() {
    this.sprite.stroke(false)
    return this
  }

  background(...args) {
    this.sprite.background(getColor(args))
    return this
  }

  rect(x, y, w, h) {
    if (!h) h = w

    this.sprite.rect(x, y, w, h)
  }

  fixedUpdate() {

  }

  update() {

  }

  render() {

  }
};

// pure drawing functions
['strokeWeight', 'textSize', 'textFont', 'textStyle', 'textAlign', 'text', 'clear'].forEach(fun => {
  Frame.prototype[fun] = function(...args) {
    this.sprite[fun](...args)
    return this
  }
});

// I/O events
['Key', 'KeyUp', 'Wheel', 'Hover', 'Unhover', 'Drag'].forEach(dir => {
  Frame.prototype[`on${dir}`] = () => { }
  Frame.prototype[`on${dir}Bubble`] = () => { }
});

// I/O mouse events
['Mouse', 'Click'].forEach(name => {
  ['', 'Drag', 'Up'].forEach(action => {
    ['', 'Left', 'Middle', 'Right'].forEach(dir => {
      Frame.prototype[`on${dir}${name}${action}`] = () => { }
      Frame.prototype[`on${dir}${name}${action}Bubble`] = () => { }
    })
  })
});

addVec2(Frame, 'prev', 'px', 'py')

// update & render => Middleware & no crawler, fixedUpdate => Middleware & crawler
createMiddleware(Frame, 'update')
createMiddleware(Frame, 'render')
createMiddleware(Frame, 'fixedUpdate')

Object.defineProperty(Frame.prototype, 'sprite', {
  get: function() {
    console.error(this);
    throw new Error('Cannot acces unexisting sprite')
  },
  set: function(value) {
    Object.defineProperty(this, 'sprite', {value})
  }
})
