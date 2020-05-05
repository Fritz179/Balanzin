class HTMLLayer extends Layer {
  constructor({size, from}) {
    super({from: false, size})

    this.useHTML = this.constructor.html

    if (from instanceof HTMLLayer) {
      this.container = document.createElement('div')
    } else if (from instanceof HTMLElement) {
      this.container = from
    } else if (from !== false) {
      this.container = document.getElementById(from || 'app')
    } else {
      console.log('TODO? In body??');
    }

    this._cachedTranslate = ''
    this._cachedScale = ''
    // this.size.bind(this.container.style, 'width', 'height')
    this.pos.bind(this.container.style, 'left', 'top', true, this.translate)
  }

  translate(x, y) {
    console.log(x, y);
    this._cachedTranslate = `translate(${x}, ${y})`
    this.sprite.canvas.style.transform = `${this._cachedTranslate} ${this._cachedScale}`
  }

  scale(x, y) {
    this._cachedScale = `scale(${x}, ${y})`
    this.sprite.canvas.style.transform = `${this._cachedTranslate} ${this._cachedScale}`
  }

  onChildAddedCapture(child) {
    if (child instanceof HTMLLayer) {
      this.container.appendChild(child.container)
    } else {
      this.container.appendChild(child.sprite.canvas)
    }
  }
}

Object.defineProperty(HTMLLayer.prototype, 'sprite', {
  get: function() {
    console.error(this);
    throw new Error(`HTMLLayer doesn't have a sprite, add a new layer or use a CanvasLayer`)
  },
  set: function(value) {
    console.error(this);
    throw new Error(`HTMLLayer cannot have a sprite, add a new layer or use a CanvasLayer`)
  }
})

// const HTMLTest = HTMLClass(Test)
//
// function HTMLClass(Master) {
//   return class extends Master {
//     constructor(...args) {
//       super(...args)
//     }
//   }
// }
