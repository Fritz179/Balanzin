class Chunk extends Layer {
  constructor(parent) {
    super()
    this._status = parent

    this.buffer = null
    this.view = null

    this.sprites = sprites.tiles

    const w = this.chunkWidth = parent.chunkWidth || 16
    const h = this.chunkHeight = parent.chunkHeight || 16

    this.setSize(w * this.tileWidth, h * this.tileWidth)
    this.graphic.background(255, 0, 255)
  }

  get tileWidth() { return this._status.tileWidth }

  update() {
    const {tile, updater, x, y} = this

    if (tile) {
      for (let xOff = 0; xOff < this.chunkWidth; xOff++) {
        tile.x = x + xOff

        for (let yOff = 0; yOff < this.chunkHeight; yOff++) {
          tile.y = y + yOff
          tile.i = yOff * this.chunkWidth + xOff

          const prev = tile.ab
          if (this.updater[this.tile.a]) this.updater[this.tile.a].call(this.tile)
          if (prev != this.tile.ab) this.drawTile(x, y, this.tile.a, this.tile.b)
        }
      }
    }
  }

  drawTile(x, y, a, b) {
    if (!a) a = this.view.getUint8((y * this.chunkWidth + x) * 4)
    if (!b) b = this.view.getUint8((y * this.chunkWidth + x) * 4 + 1)

    this.graphic.rImage(this.sprites[b], x * this.tileWidth, y * this.tileWidth)
  }

  drawTileI(i, a, b) {
    const x = i % this.chunkWidth
    const y = (i - x) / this.chunkWidth

    this.drawTile(x, y, a, b)
  }
}

class Tile {
  constructor(view) {
    this.view = view
    this.i = 0
    this.x = 0
    this.y = 0
  }

   get a() { return this.view.getUint8(this.i) }
   get b() { return this.view.getUint8(this.i + 1) }
   get c() { return this.view.getUint8(this.i + 2) }
   get d() { return this.view.getUint8(this.i + 3) }
   get ab() { return this.view.getUint16(this.i) }
   get cd() { return this.view.getUint16(this.i + 2) }

   set a(num) { this.view.setUint8(this.i, num) }
   set b(num) { this.view.setUint8(this.i + 1, num) }
   set c(num) { this.view.setUint8(this.i + 2, num) }
   set d(num) { this.view.setUint8(this.i + 3, num) }
   set ab(num) { this.view.setUint16(this.i, num) }
   set cd(num) { this.view.setUint16(this.i + 2, num) }
}
