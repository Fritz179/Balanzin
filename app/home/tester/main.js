class Master extends Layer {
  // static useHTML = true

  constructor() {
    super({size: 'fit'})

    this.setBaseScale(2, 2)
    this.addChild(this.main = new Main())
  }
}

class Main extends Layer {
  constructor() {
    super({align: 'center'})

    // this.setBaseScale(2, 2)
  }

  render() {
    this.background(51)
    this.fill(255, 255, 153)
    this.rect(-50, -50, 100, 100)
  }

  onKey({key}) {
    switch (key) {
      case '.': this.zoom(+1); break;
      case ',': this.zoom(-1); break;
    }
  }

  zoom(dir) {

  }
}
