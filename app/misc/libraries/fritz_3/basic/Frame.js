/*
  Base class for everything more than a Block
  Has all action functions (onKey etc..)
  Has all drawing functions (no sprite definition)
  Has update and fixedUpdate
*/


class Frame extends Block {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this._wasOnClick = false  // for onMouse and onClick distinction
    this._hovered = false     // for hovered

    this.changed = true

    this.rectMode = 'corner'
    this.lineMode = 'corner'
    this.ellipseMode = 'center'

    this.translateMode = [0, 0]
  }

  translate(x, y) {
    if (typeof x == 'string') {
      this.translateMode = getAlign(x)
    } else {
      this.sprite.translate(x, y)
    }
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
    this.sprite.strokeWeight(0)
    return this
  }

  background(...args) {
    this.sprite.background(getColor(args))
    return this
  }

  line(x, y, w, h) {
    this.sprite.line(...modeAdjust(x, y, w, h, this.lineMode))
  }

  ellipse(x, y, w, h, r = 0) {
    if (!h) h = w

    this.sprite.ellipse(...modeAdjust(x, y, w, h, this.ellipseMode), r)
  }

  rect(x, y, w, h) {
    if (!h) h = w

    this.sprite.rect(...modeAdjust(x, y, w, h, this.rectMode))
  }

  image(img, x = 0, y = 0, w, h) {
    if (img instanceof RenderContext || img instanceof Context) {
      img = img.canvas
    }

    this.sprite.image(img, x, y, w, h)
  }

  clear() {
    if (!this.useHTML) {
      this.sprite.clear()
    }
  }
};

// pure drawing functions
['strokeWeight', 'textSize', 'textFont', 'textStyle', 'textAlign', 'text', 'lineCap'].forEach(fun => {
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

createMiddleware(Frame, 'update')
createMiddleware(Frame, 'fixedUpdate')

Object.defineProperty(Frame.prototype, 'sprite', {
  get: function() {
    console.error(this);
    throw new Error('Cannot acces unexisting sprite')
  },
  set: function(value) {
    if (value) {
      Object.defineProperty(this, 'sprite', {value})
    } else {
      console.error(this);
      throw new Error('Cannot assign empty sprite!')
    }
  }
})
