/*
  API to js canvas API
*/

class Context {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled = false

    this.textSize = 10
    this.textFont = 'sans-serif'
    this.textStyle = 'normal'

    this.doStroke = true
    this.doFill = true

    this.cachedFillStyle = false
    this.cachedStrokeStyle = false
    this.cachedStrokeWeight = false
    this.cachedTextStyle = false
    this.cachedTextAlign = false
    this.cachedTextBaseline = false

    this.applyTextStyle()
  }

  get topCtx() { return this }

  smooth(bool) {
    this.canvas.imageSmoothingEnabled = bool
  }

  // if black fillStyle = rgb(0) => true
  fill(fillStyle) {
    this.doFill = fillStyle

    if (fillStyle && this.cachedFillStyle !== fillStyle) {
      this.ctx.fillStyle = fillStyle
      this.cachedFillStyle = fillStyle
    }
  }

  stroke(strokeStyle) {
    this.doStroke = strokeStyle && this.doStroke

    if (strokeStyle && this.cachedStrokeStyle !== strokeStyle) {
      this.ctx.strokeStyle = strokeStyle
    }

    // set even if strokeStyle is false
    this.cachedStrokeStyle = strokeStyle
  }

  strokeWeight(strokeWeight = 1) {
    this.doStroke = weight && this.cachedStrokeStyle

    if (strokeWeight && this.cachedStrokeWeight !== strokeWeight) {
      this.ctx.strokeWeight = strokeWeight
    }

    // set even if strokeWeight is false
    this.cachedStrokeWeight = strokeWeight
  }

  textSize(size = 10) {
    this.textSize = size
    this.applyTextStyle()
  }

  textFont(font = 'sans-serif') {
    this.textFont = font
    this.applyTextStyle()
  }

  textStyle(style = 'normal') {
    this.textStyle = style
    this.applyTextStyle()
  }

  applyTextStyle() {
    const style = `${this.textStyle} ${this.textSize}px ${this.textFont}`

    if (this.cachedTextStyle !== style) {
      this.ctx.font = style
      this.cachedTextStyle = style
    }
  }

  textAlign(w, h) {
    if (w && w != this.cachedTextAlign) {
      this.ctx.textAlign = w
      this.cachedTextAlign = w
    }

    if (h && h != this.cachedTextBaseline) {
      this.ctx.textBaseline = h
      this.cachedTextBaseline = h
    }
  }

  text(txt, x, y) {
    if (this.doFill || this.doStroke) {
      this.ctx.fillText(txt, x, y)
    }
  }

  background(color) {
    if (!this.cachedFillStyle) {
      this.cachedFillStyle = this.ctx.fillStyle
    }

    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = this.cachedFillStyle
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  image(img, x, y) {
    this.ctx.drawImage(img, x, y)
  }

  rect(x, y, w, h) {
    if (!this.doStroke && !this.doFill)
      return

    const {ctx} = this

    if (this.doStroke && this.lineWidth % 2 == 1) {
      ctx.translate(0.5, 0.5)
    }

    ctx.beginPath()
    ctx.rect(x, y, w, h);
    ctx.closePath()

    if (this.doStroke) {
      ctx.stroke();
    }

    if (this.doFill) {
      ctx.fill();
    }

    if (this.doStroke && this.lineWidth % 2 == 1) {
      ctx.translate(-0.5, -0.5)
    }
  }








  // clear() {
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // }
  //
  // image(...args) {
  //   let trusted = false
  //   if (args[args.length - 1] === true) {
  //     trusted = args.splice(args.length - 1, 1)[0]
  //   }
  //
  //   const len = args.length
  //   if (!len) console.error('Invalid image args, minimun 1!');
  //
  //   // pars args
  //   const sprite = args[0]
  //   const destination = this.canvas
  //   if (!destination) {
  //     debugger
  //   }
  //   let dx = len > 2 ? args[1] : (sprite.x || 0)
  //   let dy = len > 2 ? args[2] : (sprite.y || 0)
  //   let dw = len > 4 ? args[3] : (sprite.w || sprite.width)
  //   let dh = len > 4 ? args[4] : (sprite.h || sprite.height)
  //   let sx = len > 6 ? args[5] : 0
  //   let sy = len > 6 ? args[6] : 0
  //   let sw = len > 8 ? args[7] : (sprite.w || sprite.width)
  //   let sh = len > 8 ? args[8] : (sprite.h || sprite.height)
  //   const xm = sw / dw
  //   const ym = sh / dh
  //
  //   // console.log(xm);
  //
  //   const f = Math.floor
  //   const c = Math.ceil
  //
  //   if (!trusted) {
  //     if (sx >= sprite.width || sy >= sprite.height) return
  //     if (dx >= destination.width || dy >= destination.height) return
  //     if (sx + sw < 0 || sy + sh < 0 || dx + dw <= 0 || dy + dh <= 0) return
  //
  //     // optimise sprite position
  //     if (sx < 0) {
  //       dx -= sx * xm
  //       sx = 0
  //     }
  //     if (sy < 0) {
  //       dy -= sy * ym
  //       sy = 0
  //     }
  //
  //     // optimise destionation position
  //     if (dx < 0) {
  //       const diff = c(dx * xm)
  //       sx -= diff // sx += Math.abs(dx)
  //       dx -= diff / xm
  //     }
  //     if (dy < 0) {
  //       const diff = c(dy * ym)
  //       sy -= diff // sy += Math.abs(dy)
  //       dy -= diff / ym
  //     }
  //
  //     // optimise sprite size
  //     if (sx + sw > sprite.width) {
  //       sw = sprite.width - sx
  //       dw = sw / xm
  //     }
  //     if (sy + sh > sprite.height) {
  //       sh = sprite.height - sy
  //       dh = sh / ym
  //     }
  //
  //     // optimise destination size
  //     if (dx + dw > destination.width) {
  //       const diff = c((destination.width - dx) * xm)
  //       dw = diff / xm
  //       sw = diff
  //     }
  //
  //     if (dy + dh > destination.height) {
  //       const diff = c((destination.height - dy) * ym)
  //       dh = diff / ym
  //       sh = diff
  //     }
  //
  //     if (sw != dw * xm || sh != dh * ym || !dw) {
  //       if (abs(sw - dw * xm > 0.0001) || abs(sh - dh * ym) > 0.0001) {
  //         debugger
  //       } else {
  //         console.warn('false positive');
  //       }
  //     }
  //     if (dx >= destination.width || dy >= destination.height) debugger
  //     if (sx + sw < 0 || sy + sh < 0 || dx + dw < 0 || dy + dw < 0) debugger
  //   }
  //
  //   if (this.width > 256 || this.width == 16) {
  //     this.ctx.drawImage(sprite, sx, sy, sw, sh, dx, dy, dw, dh)
  //     // const r = Math.round
  //     // this.ctx.drawImage(sprite, r(sx), r(sy), r(sw), r(sh), r(dx), r(dy), r(dw), r(dh))
  //   } else {
  //     this.ctx.drawImage(sprite, f(sx), f(sy), f(sw), f(sh), f(dx), f(dy), f(dw), f(dh))
  //   }
  // }
  //
  // drawHitbox(args) {
  //
  //   let {x, y, w, h} = args[0]
  //   let color = '#515151', stroke = 1
  //
  //   if (args.length == 2) {
  //     [color] = args.splice(1)
  //   } else if (args.length == 3) {
  //     [color, stroke] = args.splice(1)
  //   } else if (args.length == 4) {
  //     [x, y, w, h] = args
  //   } else if (args.length == 5) {
  //     [x, y, w, h, color] = args
  //   } else if (args.length == 6) {
  //     [x, y, w, h, color, stroke] = args
  //   } else {
  //     throw new Error('not enough (o magari trop) params.........')
  //   }
  //
  //   const prevWidth = this.ctx.lineWidth
  //   const prevColor = this.ctx.strokeStyle
  //
  //   this.ctx.translate(0.5, 0.5)
  //   this.stroke(color)
  //   this.strokeWeight(stroke)
  //   const f = Math.floor
  //   this.ctx.strokeRect(f(x), f(y), f(w - 1), f(h - 1))
  //   this.ctx.translate(-0.5, -0.5)
  //
  //   this.ctx.lineWidth = prevWidth
  //   this.ctx.strokeStyle = prevColor
  // }
  //
  // line([x, y, w, h]) {
  //   const {ctx} = this
  //
  //   if (!ctx.doStroke) {
  //     return new Error('Cannot draw line with no stroke')
  //   }
  //
  //   if (ctx.lineWidth % 2 == 1) {
  //     ctx.translate(0.5, 0.5)
  //   }
  //
  //   ctx.beginPath();
  //   ctx.moveTo(x, y);
  //   ctx.lineTo(x + w, y + w);
  //   ctx.stroke();
  //
  //   if (ctx.lineWidth % 2 == 1) {
  //     ctx.translate(-0.5, -0.5)
  //   }
  // }
  //
  // background(color) {
  //   if (!this.cachedFillStyle) {
  //     this.cachedFillStyle = this.ctx.fillStyle
  //   }
  //
  //   this.ctx.fillStyle = color
  //   this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  //
  //   this.ctx.fillStyle = this.cachedFillStyle
  // }
}
