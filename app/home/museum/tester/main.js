const copies = 10

class Master extends Layer {
  constructor() {
    super({size: 'fill', align: 'center'}, true)

    this.addChild(this.main = new Main())
    this.addChild(this.overlay = new Test())
    // this.baseScale = 4
  }

  render() {
    // this.clear()
  }
}

class Main extends Layer {
  constructor() {
    super({size: 'fit', align: 'center'}, true)

    for (let i = copies; i > 0; i--) {
      this.addChild(new Background(i))
    }

    this.addChild(this.player = new Player())
    // this.baseScale = 4
  }

  render() {
    this.clear()
    return false
  }

  update() {
    const [x, y] = this.player.center
    const [w, h] = this.baseSize
    const [sx, sy] = this.scale

    const newX = ceil(ceil(w / 2, sx) - x * sx, sx)
    const newY = ceil(ceil(h / 2, sy) - y * sy, sy)

    this.pos = [newX, newY]
  }
}
