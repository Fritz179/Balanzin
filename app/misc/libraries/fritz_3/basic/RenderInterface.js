/*
  Has all drawing functions (no sprite definition)
*/

class RenderInterface extends Block {
  constructor(...args) {
    super(...args)

    this.rectMode = 'corner'
    this.lineMode = 'corner'
    this.ellipseMode = 'center'

    this.translateMode = [0, 0]
    this.scale = [1, 1]
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
  RenderInterface.prototype[fun] = function(...args) {
    this.sprite[fun](...args)
    return this
  }
});

Object.defineProperty(RenderInterface.prototype, 'canvas', {
  get: function () { return null },
  set: function (canvas) {
    Object.defineProperty(this, 'canvas', {value: canvas})

    this.size.listen(x => {
      this.canvas.width = x
      this.sprite.topContext.restore()
    }, y => {
      this.canvas.height = y
      this.sprite.topContext.restore()
    })
  }
})

addVec2(RenderInterface, 'scale', 'sx', 'sy')

class Sprite extends RenderInterface {
  constructor(w = 100, h = 100) {
    super(0, 0, w, h)

    this.canvas = document.createElement('canvas')
    this.canvas.width = w
    this.canvas.height = h
    this.sprite = new Context(this.canvas)

    const f = Math.floor
    this.pos.listen(() => {
      const [x, y] = this.pos
      this.canvas.style.transform = `translate(${f(x)}px, ${f(y)}px)`
    })

  }

  display(bool = true) {
    this.canvas.style.display = bool ? '' : 'none'
  }
}
