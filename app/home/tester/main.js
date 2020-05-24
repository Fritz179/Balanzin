const copies = 10

class Master extends Layer {
  static useHTML = true

  constructor() {
    super({size: 'fill', align: 'center'})

    this.addChild(this.main = new Main())
    this.addChild(this.overlay = new Overlay())
  }

  render() {
    this.clear()
  }
}

class Main extends Layer {
  static useHTML = true

  constructor() {
    super({size: 'fit', align: 'center'})

    for (let i = copies; i > 0; i--) {
      this.addChild(new Background(i))
    }

    this.addChild(this.player = new Player())
    this.baseScale.set(2, 2)
  }

  render() {
    this.clear()
    return false
  }

  update() {
    const [x, y] = this.player.center
    const [w, h] = this.size
    this.pos = [w / 2 - x * this.scale.x, h / 2 - y * this.scale.y]
  }
}
