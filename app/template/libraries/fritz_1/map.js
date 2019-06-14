class MapGame extends Game {
  constructor(tileWidth = 16) {
    super()

    this.chunks = []
    this.chunkWidth = this.chunkHeight = 16
    this.tileWidth = tileWidth

    this.updater = []

    this.addUpdateFunction(() => { this.updateChunks() })
    this.camera.addTileLayer()
    this.camera.addSpriteLayer()

  }

  get tileX() { return floor(this.mapX / this.tileWidth) }
  get tileY() { return floor(this.mapY / this.tileWidth) }

  get tile() { return this.tileAt(this.tileX, this.tileY)}
  get block() { return this.blockAt(this.tileX, this.tileY)}
  set tile(tile) { this.setTileAt(this.tileX, this.tileY, tile)}
  set block(block) { this.setBlockAt(this.tileX, this.tileY, block)}

  tileAt(x, y, offset = 0, length = 2) {
    //check if request doesn't overflow
    if (offset + length > 4) throw new Error(`Overflow error!! ${{x, y, offset, length}}`)
    if (offset < 0 || length < 0) throw new Error(`Underflow error!! ${{x, y, offset, length}}`)

    //get chunk, cordinate
    const {chunkWidth, chunkHeight} = this
    const chunkX = floor(x / chunkWidth)
    const chunkY = floor(y / chunkHeight)

    const i = (y - chunkY * chunkHeight) * chunkWidth + (x - chunkX * chunkWidth)

    //chenk if chunx exists and is loaded
    if (!this.chunks[chunkX]) return 0
    if (!this.chunks[chunkX][chunkY]) return 0
    if (!this.chunks[chunkX][chunkY].view) return 0

    const {view} = this.chunks[chunkX][chunkY]

    //get value (*4 for the 32 bit each tile)
    switch (length) {
      case 1: return view.getUint8(i * 4 + offset); break;
      case 2: return view.getUint16(i * 4 + offset); break;
      case 4: return view.getUint32(i * 4); break;
    }
  }

  tileAtPos(x, y) {
    return this.tileAt(floor(x / this.tileWidth), floor(y / this.tileWidth))
  }

  blockAt(x, y) {
    const id = this.tileAt(x, y, 0, 1)

    return id
  }

  setTileAt(x, y, a, b, c, d) {
    //get chunk, cordinate
    const {chunkWidth, chunkHeight} = this
    const chunkX = floor(x / chunkWidth)
    const chunkY = floor(y / chunkHeight)

    const i = (y - chunkY * chunkHeight) * chunkWidth + (x - chunkX * chunkWidth)

    //chenk if chunx exists and is loaded
    if (!this.chunks[chunkX]) return -1
    if (!this.chunks[chunkX][chunkY]) return -1
    if (!this.chunks[chunkX][chunkY].view) return -1

    this.chunks[chunkX][chunkY].view.setUint16(i * 4, a)
    if (b) this.chunks[chunkX][chunkY].view.setUint8(i * 4 + 1, b)
    if (c) this.chunks[chunkX][chunkY].view.setUint16(i * 4 + 2, c)
    if (d) this.chunks[chunkX][chunkY].view.setUint8(i * 4 + 3, d)

    this.chunks[chunkX][chunkY].drawTileI(i)
  }

  updateChunks() {
    for (let x in this.chunks) {
      const col = this.chunks[x]

      for (let y in col) {
        col[y].update()
      }
    }
  }

  setChunkAt(chunkX, chunkY, map) {
    //create new chunk
    const chunk = new Chunk(this)

    const {chunkWidth, chunkHeight} = chunk
    const {w, h, graphicalMap} = map

    //check if chunk size is right
    if (chunkWidth * chunkHeight != graphicalMap.length) throw new Error(`Invalid graphicalMap length!! ${graphicalMap.length}`)
    if (w != chunkWidth || h != chunkHeight) throw new Error(`Invalid chunkWidth!!, ${w, h}`)

    //create view, add the updater
    chunk.buffer = new ArrayBuffer(w * h * 4)
    chunk.view = new DataView(chunk.buffer)
    chunk.tile = new Tile(chunk.view)
    chunk.updater = this.updater

    //set tiles in buffer and draw them
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const i = y * w + x
        chunk.view.setUint16(i * 4, graphicalMap[i])
        chunk.drawTile(x, y)
      }
    }

    //create col if not present
    if (!this.chunks[chunkX]) this.chunks[chunkX] = []
    this.chunks[chunkX][chunkY] = chunk

    for (key in map.toSpawn) {
      key = key.toLowerCase()
      if (!this.ecs.spawners[key]) throw new Error(`failed to load map ${name}, ${key} spawner not found:\n`, spawners)
      map.toSpawn[key].forEach(args => {
        this.ecs.spawners[key](...args, this)
      })
    }
  }

  unloadChunk(x, y) {
    const {chunks} = this
    chunks[x][y].graphic.remove()
    delete chunks[x][y]

    let flag = true
    for (let yOff in chunks[x]) {
      if (chunks[x][yOff]) {
        flag = false
        break;
      }
    }

    if (flag) delete chunks[x]
  }

  deleteChunk(chunk) {
    if (!chunk) return
  }

  setMap(map) {
    //despawn all old entities
    this.ecs.despawnAll()

    //reset chunks
    this.chunks = []

    //update chunkSize to fit them ap in one chunk
    this.chunkWidth = map.w
    this.chunkHeight = map.h

    //load chunk
    this.setChunkAt(0, 0, map)

    // TODO: change collision definition
    this.collisions = sprites.tiles.tilePieces.collision
  }
}

class ChunkGame extends MapGame {
  constructor(tileWidth) {
    super(tileWidth)

    this.chunkX = this.chunkY = null
    this.preW = this.preH = 3
    this.postW = this.postH = 4

    this.addUpdateFunction(this.updateChunkBoarder.bind(this))
  }

  loadChunkAt() { throw new Error('Map does not have a loadChunkAt, if intentional use MapGame insted') }

  updateChunkBoarder() {
    const {chunkWidth, chunkHeight, preW, preH, postW, postH, chunks, tileWidth} = this

    let {x, y} = this.camera.center
    x = floor(x / tileWidth / chunkWidth)
    y = floor(y / tileWidth / chunkHeight)

    if (this.chunkX != x || this.chunkY != y) {
      this.chunkX = x
      this.chunkY = y

      for (let xOff = -preW; xOff <= preW; xOff++) {
        if (!chunks[x + xOff]) chunks[x + xOff] = []

        for (let yOff = -preH; yOff <= preH; yOff++) {
          if (!chunks[x + xOff][y + yOff]) this.setChunkAt(x + xOff, y + yOff, this.loadChunkAt(x + xOff, y + yOff))
        }
      }

      for (let xOff in chunks) {
        const col = chunks[xOff]

        for (let yOff in col) {
          if (x - xOff < -postW || x - xOff > postW || y - yOff < -postH || y - yOff > postH) this.unloadChunk(xOff, yOff)
        }
      }
    }

    this.updateChunks()
  }

  settings(settings = {}) {
    const {chunkWidth, chunkHeight, preW, preH, postW, postH} = settings

    if (preW) this.preW = preW
    if (preH) this.preH = preH
    if (postW) this.postW = postW
    if (postH) this.postH = postH

    if (chunkWidth || chunkHeight) {
      if (chunkWidth) this.chunkWidth = chunkWidth
      if (chunkHeight) this.chunkHeight = chunkHeight

      this.chunks = []
    }
  }
}
