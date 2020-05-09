class Master extends Layer {
  static useHTML = true

  constructor() {
    super({size: 'fill'})

    this.setBaseScale(2, 2)
    this.addChild(this.main = new Main())
  }
}

class Main extends Layer {
  constructor() {
    super({align: 'center', size: [101, 101]})

    this.setBaseScale(2, 2)
    // this.setBaseScale(4, 4)
  }

  render() {
    this.background(102)
    this.fill(255, 255, 153)

    const s = 50
    this.rectMode = 'radius'
    this.lineMode = 'radius'
    this.rect(0, 0, s, s)
    this.noStroke()
    this.fill('red')
    this.ellipse(s / 2, s / 2, s / 2)
    this.strokeWeight(1)
    this.line(0, 0, s, 0)
    this.line(0, 0, 0, s)
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
