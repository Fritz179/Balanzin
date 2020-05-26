const copies = 10

class Master extends Layer {
  constructor() {
    super({size: 'fill', align: 'center'}, true)

    this.addChild(this.main = new Main())
    this.addChild(this.overlay = new Test())
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
    // this.baseScale = 2
  }

  render() {
    this.clear()
    return false
  }

  update() {
    const [x, y] = this.player.center
    const [w, h] = this.baseSize

    this.pos = [Math.ceil(Math.ceil(w / 2) - x * this.scale.x), Math.ceil(Math.ceil(h / 2) - y * this.scale.y)]
  }
}
