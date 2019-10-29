export default class Background {
  constructor(level) {
    this.level = level
    this.ts = level.camera.tileSize
    this.ct = level.camera.chunkTile
    this.cs = level.camera.chunkSize

    this.x = level.camera.x
    this.y = level.camera.y
    this.xc = Math.floor(this.x / this.cs)
    this.yc = Math.floor(this.y / this.cs)
    this.xs = this.xc * this.cs
    this.ys = this.yc * this.cs

    this.cw = Math.floor(level.camera.mw / this.cs) + 2 //cw = chunks width? => how many chunks are needed to fill the entire screen
    this.ch = Math.floor(level.camera.mh / this.cs) + 2 //cw = chunks height?
    this.main = level.camera.createCanvas(this.cw * this.cs, this.ch * this.cs)
    this.chunks = []
    for (let i = 0; i < this.cw; i++) {
      this.chunks[i] = []
      for (let j = 0; j < this.ch; j++) {
        this.chunks[i][j] = level.camera.createCanvas(this.cs, this.cs)
      }
    }

    this.sameXPos = false
    this.sameYPos = false
    this.sameXChunk = false
    this.sameYChunk = false
  }

  draw() {
    this.testPos()

    if (!this.sameXChunk) {
      this.moveXChunk(this.px < this.x)
    }
    if (!this.sameYChunk) {
      this.moveYChunk(this.py < this.y)
    }
    if (!this.sameXChunk || !this.sameYChunk) {
      this.redrawMain()
    }
    this.level.context.clearRect(0, 0, 1920, 1080)
    this.level.context.drawImage(this.main.canvas, this.xs - this.level.camera.x, this.ys - this.level.camera.y)
  }

  moveXChunk(right) {
    const x = right ? this.chunks.length - 1 : 0
    console.log(right);

    if (right) {
      this.chunks.push(this.chunks[0])
      this.chunks.splice(0, 1)
      this.chunks[x].forEach((chunk, y) => {
        this.redrawChunk(chunk, x, y)
      })
    } else {
      this.chunks.unshift(this.chunks[this.chunks.length - 1])
      this.chunks.splice(this.chunks.length, 1)
      this.chunks[0].forEach((chunk, y) => {
        this.redrawChunk(chunk, 0, y)
      })
    }
  }

  moveYChunk(down) {
    const y = down ? this.chunks[0].length - 1 : 0

    this.chunks.forEach((col, x) => {
      //console.log(col, x);
      if (down) {
        col.push(col[0])
        col.splice(0, 1)
      } else {
        col.unshift(col[y - 1])
        col.splice(y, 1)
      }

      this.redrawChunk(col[y], x, y)
    })

  }

  redrawMain() {
    this.chunks.forEach((row, x) => {
      row.forEach((chunk, y) => {
        let xp = x * this.cs
        let yp = y * this.cs
        this.main.context.drawImage(chunk.canvas, xp, yp)
      })
    })
  }

  redrawChunk(chunk, x, y) {
    let txs = x * this.ts + this.xc * this.ct
    let tys = y * this.ts + this.yc * this.ct
    let txe = txs + this.ct
    let tye = tys + this.ct
    for (let tx = txs; tx < txe; tx++) {
      for (let ty = tys; ty < tye; ty++) {
        if (!this.level.map[tx]) {
        }
        this.level.spriteSheet.drawTile(chunk.context, (tx - txs) * this.ts, (ty - tys) * this.ts, this.level.map[tx][ty])
      }
    }
  }

  redrawAll() {
    this.chunks.forEach((row, x) => {
      row.forEach((chunk, y) => {
        this.redrawChunk(chunk, x, y)
      })
    })
    this.redrawMain()
  }

  testPos() {
    this.px = this.x
    this.py = this.y
    this.pxc = this.xc
    this.pyc = this.yc

    this.x = this.level.camera.x
    this.y = this.level.camera.y
    this.xc = Math.floor(this.x / this.cs)
    this.yc = Math.floor(this.y / this.cs)
    this.xs = this.xc * this.cs
    this.ys = this.yc * this.cs

    this.sameXPos = this.px == this.x
    this.sameYPos = this.py == this.y
    this.sameXChunk = this.pxc == this.xc
    this.sameYChunk = this.pyc == this.yc
  }
}
