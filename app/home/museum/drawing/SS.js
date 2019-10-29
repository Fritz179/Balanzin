class SS {
  constructor() {
    this.sounds = {
      mouseOver: loadSound("sounds/mouseOver.wav"),
      newLine: loadSound("sounds/newLine.flac")
    }
    this.prev = [-1, -1]
  }

  input(iT, info) {
    if (iT == "overPoint") {
      if (this.prev[0] != info[0] || this.prev[1] != info[1]) {
        this.prev = info
        this.sounds.mouseOver.play()
      }
    } else if (iT == "newLine") {
      this.sounds.newLine.play()
    }
  }
}
