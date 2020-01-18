class Canvas extends Frame {
  constructor(...args) {
    super(0, 0, 0, 0)

    let flag = false

    if (args.length == 1) {
      if (typeof args[0] == 'string') {
        let canvas

        if (args[0] == 'auto') {
          canvas = document.createElement('canvas');
        } else {
          canvas = document.getElementById(args[0])
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (!canvas) {
          throw new Error(`Invalid canvas: ${args[0]}`)
        }

        this.sprite = new Context(canvas);
      } else if (args[0].nodeType) {
        const canvas = document.createElement('canvas')
        canvas.width = args[0].width
        canvas.height = args[0].height
        this.sprite = new Context(canvas);
        this.sprite._image(args[0])
      } else {
        const [sprite] = args
        const canvas = document.createElement('canvas');

        this.w = canvas.width = sprite.width
        this.h = canvas.height = sprite.height
        this.sprite = new Context(canvas)
        this.image(sprite, 0, 0)
        flag = true
      }
    } else if (args.length == 2) {
      const canvas = document.createElement('canvas');
      canvas.width = args[0];
      canvas.height = args[1];

      this.sprite = new Context(canvas);
    } else if (args.length != 0) {
      throw new Error('invalid arguments length!!' + args.length)
    }

    if (!flag && this.sprite) {
      Object.defineProperty(this, 'w', {
        get() { return this.sprite.canvas.width },
        set(w) { debugger }
      })
      Object.defineProperty(this, 'h', {
        get() { return this.sprite.canvas.height },
        set(w) { debugger }
      })

      this.buffer = true
    }
  }

  set size({w, h}) { this.setSize(w, h); }

  get size() { return {w: this.w, h: this.h} }
  get topCtx() { return this.sprite.topCtx }
  get isTopCtx() { return this.topCtx == this.sprite }

  get textSize() { return this.sprite.textSize }
  get textStyle() { return this.sprite.textStyle }
  get textFont() { return this.sprite.textFont }

  setScale(x = 1, y) { this.xm = x; this.ym = y || x; this.changed = true; return this; }
  setCtx(ctx) { this.cxt = ctx; this.xm = 1; this.ym = 1; return this; }

  setSize(w, h) {
    if (this.sprite) {
      if (this.sprite != this.topCtx) debugger
      const state = getState(this.topCtx.ctx)
      this.sprite.canvas.width = w
      this.sprite.canvas.height = h
      setState(this.topCtx.ctx, state)
    }

    if (!this.buffer) {
      this.w = w
      this.h = h
    }

    this.changed = true
    return this
  }

  noSmooth() {
    this.topCtx._noSmooth()
  }

  rotate(a) {
    this.topCtx._rotate(a)
  }

  scale(x, y) {
    this.topCtx._scale(x, y)
  }

  background(...args) {
    this.topCtx._background(getColor(args))
  }

  fill(...args) {
    this.topCtx._fill(getColor(args))
  }

  clear() {
    this.topCtx._clear()
  }

  strokeWeight(w) {
    this.topCtx._strokeWeight(w)
  }

  textFont(f) {
    this.topCtx._textFont(f)
  }

  textSize(s) {
    this.topCtx._textSize(s)
  }

  textAlign(w, h) {
    this.topCtx._textAlign(w, h)
  }

  text(txt, x, y) {
    this._text(txt, x, y)
  }

  _text(txt, x, y) {
    this.sprite._text(txt, ...this.multiply([x, y]))
  }

  multiply(args, q = false) {
    if (this instanceof Layer) {
      const {xAlign, yAlign, overflow} = this.cameraMode

      if (this.buffer) {
        args[0] = (args[0] + (this.sprite.x + this.w * xAlign)) * this.xm + this.sprite.w * xAlign
        args[1] = (args[1] + (this.sprite.y + this.h * yAlign)) * this.ym + this.sprite.h * yAlign
      } else {
        args[0] = (args[0] + (this.x + this.w * xAlign)) * this.xm + this.sprite.w * xAlign
        args[1] = (args[1] + (this.y + this.h * yAlign)) * this.ym + this.sprite.h * yAlign
      }
      if (q) {
        args[2] *= this.xm
        args[3] *= this.ym
      }
    } else {

      args[0] = (args[0] - this.x) * this.xm
      args[1] = (args[1] - this.y) * this.ym

      if (q) {
        args[2] *= this.xm
        args[3] *= this.ym
      }
    }

    return args
  }

  rect(...args) {
    if (args.length == 4) {
      this._rect(args)
    } else { // quadru
      this._rect(args.push(args[2]))
    }
  }

  _rect(args) {
    this.sprite._rect(this.multiply(args, true))
  }

  image(canvas, ...val) {
    const {args, options} = separate(val, {trusted: false, hitbox: false})

    if (canvas instanceof Canvas) canvas = canvas.sprite.canvas
    else if (canvas instanceof Context) canvas = canvas.canvas

    this._image(
      canvas,
      args[0] || 0, args[1] || 0,
      args[2] || canvas.w || canvas.width, args[3] || canvas.h || canvas.height,
      args[4] || 0, args[5] || 0,
      args[6] || canvas.w || canvas.width, args[7] || canvas.h || canvas.height,
      options.trusted, options.hitbox
    )
  }

  _image(canvas, ...args) {
    this.sprite._image(canvas, ...this.multiply(args.slice(0, 9), true))
    if (args[9]) {
      this._drawHitbox(args.slice(0, 4).concat(['red']))
    }
  }

  drawHitbox(...args) { this._drawHitbox(args) }
  _drawHitbox(args) { this.sprite._drawHitbox(this.multiply(args, true)) }
}

const valuesToSave = ['strokeStyle', 'fillStyle', 'globalAlpha', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit', 'lineDashOffset', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor', 'globalCompositeOperation', 'font', 'textAlign', 'textBaseline', 'direction', 'imageSmoothingEnabled']
function getState(ctx) {
  const ret = {}
  valuesToSave.forEach(val => {
    ret[val] = ctx[val]
  })
  return ret
}

function setState(ctx, state) {
  valuesToSave.forEach(val => {
    ctx[val] = state[val]
  })
}
