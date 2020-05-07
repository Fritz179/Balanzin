class Master extends Layer {
  static useHTML = true

  constructor() {
    super({size: 'fit'})

    this.addChild(this.main = new Main())
  }
}

class Main extends Layer {
  constructor() {
    super({align: 'center'})
    // this.sprite.canvas.style.transform = 'matrix(1, 0, 0, 0.5, 0, 0)'
    // this.sprite.canvas.style['transform-origin'] = 'top left'
    // this.setPos(10, 10)

    // this.setMult(2, 2)
  }

  render() {
    console.log('fff');
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
