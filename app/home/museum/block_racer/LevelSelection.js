class LevelSelection extends Menu {
  constructor() {
    super()
    this.listen('onKey')

    for (let i = 0; i < 3; i++) {
      this.addButton(new LevelButton(this, i))
    }

    this.setPos(960, 540)
    this.setSize(960, 540)

    this.loading = false
  }

  pre() {
    this.loading = false
  }

  onKey(input) {
    const int = parseInt(input)

    if (!isNaN(int)) this.load(int)
  }

  load(level) {
    if (this.loading) return

    this.loading = true

    loadMap(`level_${level}`, {}, json => {
      setCurrentStatus('play', json)
    })
  }
}

class LevelButton extends Button {
  constructor(parent, level) {
    super()
    this._status = parent
    this.level = level

    //set the position depending on the level
    this.setPos(300 + 600 * level, 500)

    //create custon sprite depending on the level it rappresents
    const sprite = this.sprite = createGraphics(300, 200)

    this.setSize(300, 200)

    sprite.background(255, 255, 0)
    sprite.fill(0)
    sprite.ellipse(sprite.width / 2, sprite.height / 2, sprite.height * 0.9)
    sprite.fill(255, 255, 0)
    sprite.textSize(100)
    sprite.textAlign(CENTER, CENTER)
    sprite.text(level, sprite.width / 2, sprite.height / 2)
  }

  onClick() {
    this._status.load(this.level)
  }

  getSprite() {
    return this.sprite
  }
}
