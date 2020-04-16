class RenderContext {
  constructor(from, to) {
    this.from = from
    this._to = to
  }

  get to() { return this._to || this.from.parentLayer }

  get topCtx() { return this.to.topCtx }

  background() {
    console.error(this);
    throw new Error('Cannot draw background on RenderContext')
  }

  rect(x, y, w, h) {
    this.to.rect(x, y, w, h)
  }

  rotate(a) { this.topCtx._rotate(a) }
  scale(x, y) { this.topCtx._scale(x, y)}

  background(...args) {
    if (!this.buffer) {
      console.log('background in a not buffer layer?');
    }
    this.topCtx.background(getColor(args))
  }

  fill(...args) {
    this.topCtx._fill(getColor(args))
  }

  clear() {
    this.topCtx._clear()
  }

  multiply(args, q = false) {
    if (this instanceof Layer) {
      const {xAlign, yAlign, overflow} = this.cameraMode

      if (this.buffer) {
        // console.log(this);
        const middleX = this.sprite.x + this.sprite.w * this.cameraMode.xAlign
        const middleY = this.sprite.y + this.sprite.h * this.cameraMode.yAlign
        // console.log(this.parentSprite.w, middleX, args[0]);
        args[0] = this.parentSprite.w * xAlign + (args[0] - middleX) * this.xm
        args[1] = this.parentSprite.h * yAlign + (args[1] - middleY) * this.ym
        // args[0] = (args[0] + (this.sprite.x + this.w * xAlign)) * this.xm + this.sprite.w * xAlign
        // args[1] = (args[1] + (this.sprite.y + this.h * yAlign)) * this.ym + this.sprite.h * yAlign
      } else {
        const middleX = this.sprite.w * xAlign
        const middleY = this.sprite.h * yAlign

        args[0] = this.parentSprite.w * xAlign + (args[0] - middleX + this.x) * this.xm
        args[1] = this.parentSprite.h * yAlign + (args[1] - middleY + this.y) * this.ym
        // args[0] = (args[0] + (this.x + this.w * xAlign)) * this.xm + this.sprite.w * xAlign
        // args[1] = (args[1] + (this.y + this.h * yAlign)) * this.ym + this.sprite.h * yAlign
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

  scalePoints(args) {
    const {x, y, xm, ym} = this

    if (this.buffer) {
      if (args.length == 2) {
        return [args[0] * xm, args[1] * ym]
      } else {
        return [args[0] * xm, args[1] * ym, args[2] * xm, args[3] * ym]
      }

    } else {
      if (args.length == 2) {
        return [args[0] * xm + x, args[1] * ym + y]
      } else {
        return [args[0] * xm + x, args[1] * ym + y, args[2] * xm, args[3] * ym]
      }
    }
  }

  // rect(...args) {
  //   // console.log(this.parentSprite);
  //
  //   if (args.length == 4) {
  //     this._rect(args)
  //   } else { // quadru
  //     this._rect(args.push(args[2]))
  //   }
  // }

  _rect(args) {
    this.parentSprite._rect(this.scalePoints(args))
  }

  line(...args) {
    this._line(args)
  }

  _line(args) {
    this.parentSprite._line(this.scalePoints(args))
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
    this.parentSprite._image(canvas, ...this.multiply(args.slice(0, 9), true))
    if (args[9]) {
      this._drawHitbox(args.slice(0, 4).concat(['red']))
    }
  }

  drawHitbox(...args) { this._drawHitbox(args) }
  _drawHitbox(args) { this.parentSprite._drawHitbox(this.multiply(args, true)) }
};

['smooth', 'fill', 'stroke', 'strokeWeight', 'textSize', 'textFont', 'textStyle', 'textAlign', 'text', 'clear'].forEach(fun => {
  RenderContext.prototype[fun] = function(...args) {
    this.to[fun](...args)
    return this
  }
})
