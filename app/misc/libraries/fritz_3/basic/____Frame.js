class Frame extends Block {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    let flag = false

    if (args.length == 1) {
      if (typeof args[0] == 'string') {
        let canvas

        if (args[0] == 'auto') {
          canvas = document.createElement('canvas');
          canvas.width = 0;
          canvas.height = 0;
        } else {
          canvas = document.getElementById(args[0])
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }


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
        this.parentSprite = this.sprite
        this.image(sprite, 0, 0)
        // flag = true
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
    } else {
      this.sprite = new Context()
    }

    this.parentSprite = this.sprite
  }

  set size({w, h}) { this.setSize(w, h); }

  get size() { return {w: this.w, h: this.h} }
  get topCtx() { return this.parentSprite.topCtx }
  get isTopCtx() { return this.topCtx == this.parentSprite }

  get textSize() { return this.sprite.textSize }
  get textStyle() { return this.sprite.textStyle }
  get textFont() { return this.sprite.textFont }

  setScale(x = 1, y) { this.xm = x; this.ym = y || x; this.changed = true; return this; }
  setCtx(ctx) { this.cxt = ctx; this.xm = 1; this.ym = 1; return this; }

  setSize(w, h, even = false) {
    if (even) {
      w = ceil(w / 2) * 2
      h = ceil(h / 2) * 2
    }

    if (this.buffer) {
      if (this.sprite != this.topCtx) debugger
      const state = getState(this.topCtx.ctx)
      this.sprite.canvas.width = w
      this.sprite.canvas.height = h
      setState(this.topCtx.ctx, state)
    } else {
      this.w = w
      this.h = h
    }

    this.changed = true
    return this
  }


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
