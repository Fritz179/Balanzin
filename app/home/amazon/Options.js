class Options extends Menu {
  constructor() {
    super()

    this.listen('onKey')

    this.boardSize = 6
    this.display = new Display(this)
    this.ecs.spawn(this.display)
    this.ecs.spawn(new PlayButton(this))
  }

  onKey(input) {
    const int = parseInt(input)
    if (!isNaN(int)) {
      this.boardSize = int
    }

    switch (input) {
      case '+': this.boardSize++; break;
      case '-': this.boardSize--; break;
      case 'p': setCurrentStatus('play', this.boardSize); break;
    }

    this.display.update()
  }

  pre(size = 6) {
    this.boardSize = size
  }
}

class Display extends Entity {
  constructor(parent) {
    super()

    this._status = parent
    this.setSize(1920, 1080)
    this.setPos(0, 0)

    this.sprite = createGraphics(1920, 1080)
    this.sprite.textAlign(CENTER, CENTER)
    this.sprite.textSize(150)

    this.update()
  }

  update() {
    const {boardSize} = this._status
    this.sprite.background(102)

    this.sprite.text(`Board size: ${boardSize}`, this.w / 2, this.h / 2 * 0.7)
  }

  getSprite() {
    return this.sprite
  }
}

class PlayButton extends Button {
  constructor(parent) {
    super()

    this._status = parent

    this.setSize(400, 200)
    this.setPos((1920 - this.w) / 2, (1080 - this.h) / 2 * 1.4)

    this.sprite = createGraphics(this.w, this.h)
    this.sprite.background(255)
    this.sprite.textAlign(CENTER, CENTER)
    this.sprite.textSize(100)
    this.sprite.text('play', this.w / 2, this.h / 2)

    this.listen('onClick')
  }

  getSprite() {
    return this.sprite
  }

  onClick() {
    setCurrentStatus('play', this._status.boardSize)
  }
}
