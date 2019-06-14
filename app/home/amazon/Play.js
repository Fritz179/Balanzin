class Play extends Status {
  constructor() {
    super()

    this.listen('onKey')
    this.setPos((1920 - 800) / 2 - 25, (1080 - 800) / 2 - 25)
    this.setSize(850, 850)

    this.cameraSettings({w: 850, r: 1, smooth: true})
    cameraSettings({smooth: true})

    this.sprite = createGraphics(850, 850)
    this.sprite.background(102, 51, 0)
    this.bg = this.camera.addBackgroundLayer(this.sprite)

    this.board = new Board(this)
    this.ecs.spawn(this.board)

    this.camera.addSpriteLayer()
  }

  pre(size) {
    this.board.start(size)
  }

  onKey(input) {
    switch (input) {
      case 'Escape': setCurrentStatus('options', this.board.board.length); break;
    }
  }
}

class Board extends Entity {
  constructor(parent) {
    super()

    this._status = parent
    this.setSize(800, 800)
    this.setPos(25, 25)
    this.sprite = createGraphics(800, 800)
    this.sprite.background(255)
    this.sprite.strokeWeight(3)

    this.listen('click', 'onKey')

    this.holding = 0
    this.holdingX = this.holdingY = 0
  }

  get tileX() { return floor(this.mouseX / this.cellWidth) }
  get tileY() { return floor(this.mouseY / this.cellWidth) }

  onClick() {
    const {tileX, tileY} = this

    if (this.board[tileX] && this.board[tileX][tileY]) {
      this.holding = this.board[tileX][tileY]
      this.board[tileX][tileY] = 0
      this.holdingX = tileX
      this.holdingY = tileY
    }
  }

  onClickDragged() {

  }

  onClickReleased() {
    const {tileX, tileY} = this
    if (this.board[tileX] && this.board[tileX][tileY] === 0) {
      this.board[tileX][tileY] = this.holding
      this.holding = 0
    } else {
      console.log(this.holding);
      this.board[this.holdingX][this.holdingY] = this.holding
      this.holding = 0
    }
  }

  onKey(input) {
    const int = input == ' ' ? 3 : parseInt(input)

    if (!isNaN(int) && int >= 0 && int < 4) {
      const {tileX, tileY} = this
      if (tileX >= 0 && tileX < this.board.length) {
        const col = this.board[tileX]

        if (tileY >= 0 && tileY < col.length) {
          col[tileY] = int
        }
      }
    }
  }

  update() {
    const {sprite, cellWidth} = this

    this.board.forEach((col, x) => {
      col.forEach((cell, y) => {
        if ((x + y) % 2 == 0) sprite.fill(218, 165, 32)
        else sprite.fill(255, 205, 72)

        sprite.rect(x * cellWidth, y * cellWidth, cellWidth, cellWidth)

        if (cell) {
          if (cell == 1) sprite.fill(255)
          else if (cell == 2) sprite.fill(0)
          else sprite.fill(255, 0, 0)
          sprite.ellipse(x * cellWidth + cellWidth / 2, y * cellWidth + cellWidth / 2, cellWidth * 0.8)
        }
      })
    })

    if (this.holding) {
      if (this.holding == 1) sprite.fill(255)
      else if (this.holding == 2) sprite.fill(0)
      else sprite.fill(255, 0, 0)
      sprite.ellipse(this.mouseX, this.mouseY, cellWidth * 0.8)
    }
  }

  start(size) {
    const w = this.cellWidth = 800 / size

    this.board = []
    for (let x = 0; x < size; x++) {
      this.board[x] = []
      for (let y = 0; y < size; y++) {
        this.board[x][y] = 0
      }
    }
  }

  getSprite() {
    return this.sprite
  }
}
