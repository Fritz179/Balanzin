/*
  API to js canvas API
*/

// strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, lineDashOffset, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation, font, textAlign, textBaseline, direction, imageSmoothingEnabled
const cachedStyles = ['strokeStyle', 'fillStyle', 'lineWidth', 'font', 'textAlign', 'textBaseline', 'imageSmoothingEnabled', 'lineCap']

class Context {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.cache = {}

    // default imageSmoothingEnabled to false instead
    this.ctx.imageSmoothingEnabled = false
    this.save()
  }

  get topContext() { return this }
  get topCtx() { return this.ctx }

  save() {
    cachedStyles.forEach(style => {
      this.cache[style] = this.ctx[style]
    })
  }

  restore() {
    cachedStyles.forEach(style => {
      this.ctx[style] = this.cache[style]
    })
  }

  textAlign(w, h) {
    if (w && w != this.cache.textAlign) {
      this.ctx.textAlign = w
      this.cache.textAlign = w
    }

    if (h && h != this.cache.textBaseline) {
      this.ctx.textBaseline = h
      this.cache.textBaseline = h
    }
  }

  text(txt, x, y) {
    if (this.cache.fillStyle || this.cache.lineWidth) {
      this.ctx.fillText(txt, x, y)
    }
  }

  background(color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = this.cache.fillStyle
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  translate(x, y) {
    console.log(x, y);
    this.ctx.translate(x, y)
  }

  image(img, ...args) {
    const [x, y, w, h] = minMax(args, 2)

    this.ctx.drawImage(img, x, y, w, h)
  }

  rect(...args) {
    if (!this.cache.lineWidth && !this.cache.fillStyle)
      return

    const [x, y, w, h] = minMax(args, 2)
    const {ctx} = this

    if (this.cache.lineWidth % 2 == 1) {
      ctx.translate(0.5, 0.5)
    }

    ctx.beginPath()
    ctx.rect(x, y, w, h);
    ctx.closePath()

    if (this.cache.fillStyle) {
      ctx.fill();
    }

    if (this.cache.lineWidth) {
      ctx.stroke();
    }

    if (this.cache.lineWidth % 2 == 1) {
      ctx.translate(-0.5, -0.5)
    }
  }

  line(...args) {
    if (!this.cache.lineWidth)
      return

    const [x, y, w, h] = minMax(args, 2)
    const {ctx} = this

    if (this.cache.lineWidth % 2 == 1) {
      ctx.translate(0.5, 0.5)
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();

    if (this.cache.lineWidth % 2 == 1) {
      ctx.translate(-0.5, -0.5)
    }
  }

  ellipse(x, y, w, h, r) {
    if (!this.cache.lineWidth && !this.cache.fillStyle)
      return

    [x, y, w, h] = minMax([x + w / 2, y + w / 2, w, h], 2)
    const {ctx} = this

    ctx.beginPath()
    ctx.ellipse(x, y, w, h, r, 0, 2 * Math.PI);
    ctx.closePath()

    if (this.cache.fillStyle) {
      ctx.fill();
    }

    if (this.cache.lineWidth) {
      ctx.stroke();
    }
  }

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
}

// text values
['textStyle', 'textFont', 'textSize'].forEach(name => {
  Object.defineProperty(Context.prototype, name, {
    value: function(val) {
      if (this.cache[name] != val) {
        this.cache[name] = val

        const {textStyle, textFont, textSize} = this.cache
        this.applyTextStyle(`${textStyle} ${textSize}px ${textFont}`)
      }
    }
  })
});

// directy to ctx
[
  ['smooth', 'imageSmoothingEnabled'],
  ['fill', 'fillStyle'],
  ['stroke', 'strokeStyle'],
  ['strokeWeight', 'lineWidth'],
  ['applyTextStyle', 'font'],
  ['lineCap']
].forEach(([funName, propName]) => {
  if (!propName) propName = funName

  Object.defineProperty(Context.prototype, funName, {
    value: function(val) {
      if (this.cache[propName] != val) {
        this.cache[propName] = val
        this.ctx[propName] = val
      }
    }
  })
});

function modeAdjust(x, y, w, h, mode) {
  if (mode == 'corner') {
    return minMax([x, y, w, h], 2)
  } else if (mode == 'corners') {
    return minMax([x, y, w - x, h - y], 2)
  } else if (mode == 'radius') {
    return minMax([x - w, y - h, w * 2, h * 2], 2)
  } else if (mode == 'center') {
    return minMax([x - w / 2, y - h / 2, w, h], 2)
  } else {
    throw new Error('Invalid mode: ' + mode)
  }
}
