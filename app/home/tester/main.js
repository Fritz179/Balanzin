const copies = 10

class Master extends Layer {
  static useHTML = true

  constructor() {
    super({size: 'fill', align: 'center'})

    for (let i = copies; i > 0; i--) {
      this.addChild(new Background(i))
    }

    this.addChild(this.main = new Main())
  }

  render() {
    this.clear()
  }
}

class Main extends Layer {
  static useHTML = true

  constructor() {
    super()

    this.addChild(this.player = new Player())
  }

  update() {
    this.center = this.player.center
    this.pos.mult(-1)
  }
}
