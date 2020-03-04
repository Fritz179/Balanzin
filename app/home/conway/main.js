const ROWS = 200, COLS = 300, CELL_SIZE = 5
let main

function setup() {
  addLayer(main = new Main())
  addLayer(new Overlay())
}

class Main extends SpriteLayer {
  constructor() {
    super('auto')

    this.setScale(1)
    this.setPos(50, 130)
    this.setSize((COLS * CELL_SIZE + 1) * this.xm, (ROWS * CELL_SIZE + 1) * this.ym)

    this.cells = []

    for (let i = 0; i < ROWS * COLS; i++) {
      this.cells[i] = random() > 0.5
    }

    this.prevCells = []

    this.updates = 0
    this.sprites = 0
  }

  update() {

    const newCells = []

    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const i = y * COLS + x
        const offsets = this.getOffsets(x == 0, x == COLS - 1)
        let liveNeighbours = 0

        offsets.forEach(offset => {
          if (offset && this.cells[i + offset]) {
            liveNeighbours++
          }
        })

        if (this.cells[i]) {
          newCells[i] = liveNeighbours == 2 || liveNeighbours == 3
        } else {
          newCells[i] = liveNeighbours == 3
        }
      }
    }

    this.cells = newCells
    this.changed = true

    if (this.sprites == 0) this.prevCells = this.cells.map(i => !i)
  }

  getOffsets(l, r) {
    const w = COLS
    return [l ? 0 : -w - 1, -w, r ? 0 : -w + 1, l ? 0 : -1, r ? 0 : 1, l ? 0 : w - 1, w, r ? 0 : w + 1]
  }

  getSprite() {
    this.sprites++

    // if (this.sprites < 5) return
    // this.sprites = 0
    // this.background(255)

    this.strokeWeight(1);
    [true, false].forEach(bool => {
      this.fill(bool ? 0 : 255)

      for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
          const i = y * COLS + x

          if (this.prevCells[i] != this.cells[i] && this.cells[i] == bool) {
            this.rect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 1, CELL_SIZE - 1)
          }
        }
      }
    })



    this.prevCells = this.cells
  }
}
