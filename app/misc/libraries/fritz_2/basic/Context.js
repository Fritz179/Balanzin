class Context extends Block {
  constructor(canvas) {
    super()

    if (canvas) {
      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      this.ctx.imageSmoothingEnabled = false

      Object.defineProperty(this, 'w', {
        get() { return this.canvas.width },
        set(w) { debugger }
      })
      Object.defineProperty(this, 'h', {
        get() { return this.canvas.height },
        set(w) { debugger }
      })
    } else {
      this.canvas = null
      this.ctx = null
    }

    this.textSize = 10
    this.textFont = 'sans-serif'
    this.textStyle = 'normal'
    this._doStroke = true
    this._doFill = true
  }

  get topCtx() { return this }

  _noSmooth() {
    this.canvas.imageSmoothingEnabled = false
  }

  _fill(color) {
    this.ctx.fillStyle = color
  }

  _stroke(color) {
    this.ctx.strokeStyle = color
  }

  _strokeWeight(weight = 1) {
    this.ctx.lineWidth = weight
    this._doStroke = weight
  }

  _rotate(a) {
    this.ctx.rotate(a)
  }

  _scale(x, y) {
    this.ctx.scale(x, y)
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _textSize(s = 10) {
    this.textSize = s
    this._updateFont()
  }

  _textFont(f = 'sans-serif') {
    this.textFont = f
    this._updateFont()
  }

  _textStyle(s = 'normal') {
    this.textStyle = s
    this._updateFont()
  }

  _updateFont() {
    this.ctx.font = `${this.textStyle} ${this.textSize}px ${this.textFont}`
  }

  _textAlign(w, h) {
    if (w) {
      this.ctx.textAlign = w
      if (h) {
        this.ctx.textBaseline = h
      }
    }
  }

  _text(txt, x, y) {
    this.ctx.fillText(txt, x, y)
  }

  _image(...args) {
    let trusted = false
    if (args[args.length - 1] === true) {
      trusted = args.splice(args.length - 1, 1)[0]
    }

    const len = args.length
    if (!len) console.error('Invalid image args, minimun 1!');

    // pars args
    const sprite = args[0]
    const destination = this.canvas
    if (!destination) {
      debugger
    }
    let dx = len > 2 ? args[1] : (sprite.x || 0)
    let dy = len > 2 ? args[2] : (sprite.y || 0)
    let dw = len > 4 ? args[3] : (sprite.w || sprite.width)
    let dh = len > 4 ? args[4] : (sprite.h || sprite.height)
    let sx = len > 6 ? args[5] : 0
    let sy = len > 6 ? args[6] : 0
    let sw = len > 8 ? args[7] : (sprite.w || sprite.width)
    let sh = len > 8 ? args[8] : (sprite.h || sprite.height)
    const xm = sw / dw
    const ym = sh / dh

    // console.log(xm);

    const f = Math.floor
    const c = Math.ceil

    if (!trusted) {
      if (sx >= sprite.width || sy >= sprite.height) return
      if (dx >= destination.width || dy >= destination.height) return
      if (sx + sw < 0 || sy + sh < 0 || dx + dw <= 0 || dy + dh <= 0) return

      // optimise sprite position
      if (sx < 0) {
        dx -= sx * xm
        sx = 0
      }
      if (sy < 0) {
        dy -= sy * ym
        sy = 0
      }

      // optimise destionation position
      if (dx < 0) {
        const diff = c(dx * xm)
        sx -= diff // sx += Math.abs(dx)
        dx -= diff / xm
      }
      if (dy < 0) {
        const diff = c(dy * ym)
        sy -= diff // sy += Math.abs(dy)
        dy -= diff / ym
      }

      // optimise sprite size
      if (sx + sw > sprite.width) {
        sw = sprite.width - sx
        dw = sw / xm
      }
      if (sy + sh > sprite.height) {
        sh = sprite.height - sy
        dh = sh / ym
      }

      // optimise destination size
      if (dx + dw > destination.width) {
        const diff = c((destination.width - dx) * xm)
        dw = diff / xm
        sw = diff
      }

      if (dy + dh > destination.height) {
        const diff = c((destination.height - dy) * ym)
        dh = diff / ym
        sh = diff
      }

      if (sw != dw * xm || sh != dh * ym || !dw) {
        if (abs(sw - dw * xm > 0.0001) || abs(sh - dh * ym) > 0.0001) {
          debugger
        } else {
          console.warn('false positive');
        }
      }
      if (dx >= destination.width || dy >= destination.height) debugger
      if (sx + sw < 0 || sy + sh < 0 || dx + dw < 0 || dy + dw < 0) debugger
    }

    if (this.width > 256 || this.width == 16) {
      this.ctx.drawImage(sprite, sx, sy, sw, sh, dx, dy, dw, dh)
      // const r = Math.round
      // this.ctx.drawImage(sprite, r(sx), r(sy), r(sw), r(sh), r(dx), r(dy), r(dw), r(dh))
    } else {
      this.ctx.drawImage(sprite, f(sx), f(sy), f(sw), f(sh), f(dx), f(dy), f(dw), f(dh))
    }
  }

  _drawHitbox(args) {

    let {x, y, w, h} = args[0]
    let color = '#515151', stroke = 1

    if (args.length == 2) {
      [color] = args.splice(1)
    } else if (args.length == 3) {
      [color, stroke] = args.splice(1)
    } else if (args.length == 4) {
      [x, y, w, h] = args
    } else if (args.length == 5) {
      [x, y, w, h, color] = args
    } else if (args.length == 6) {
      [x, y, w, h, color, stroke] = args
    } else {
      throw new Error('not enough (o magari trop) params.........')
    }

    const prevWidth = this.ctx.lineWidth
    const prevColor = this.ctx.strokeStyle

    this.ctx.translate(0.5, 0.5)
    this._stroke(color)
    this._strokeWeight(stroke)
    const f = Math.floor
    this.ctx.strokeRect(f(x), f(y), f(w - 1), f(h - 1))
    this.ctx.translate(-0.5, -0.5)

    this.ctx.lineWidth = prevWidth
    this.ctx.strokeStyle = prevColor
  }



  _rect([x, y, w, h, color, stroke]) {
    const {ctx} = this

    if (this._doStroke && this.lineWidth % 2 == 1) {
      ctx.translate(0.5, 0.5)
    }

    ctx.beginPath()
    ctx.rect(x, y, w, h);
    ctx.closePath()

    if (this._doStroke) {
      ctx.stroke();
    }

    ctx.fill();

    if (this._doStroke && this.lineWidth % 2 == 1) {
      ctx.translate(-0.5, -0.5)
    }
  }

  _line([x, y, w, h]) {
    const {ctx} = this

    if (!ctx._doStroke) {
      return new Error('Cannot draw line with no stroke')
    }

    if (ctx.lineWidth % 2 == 1) {
      ctx.translate(0.5, 0.5)
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + w);
    ctx.stroke();

    if (ctx.lineWidth % 2 == 1) {
      ctx.translate(-0.5, -0.5)
    }
  }

  _background(color) {
    const prev = this.ctx.fillStyle

    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = prev
  }
}
