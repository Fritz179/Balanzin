/*
  chunkWidth = tiles in a chunk
  tileWidth = width of a tile in px
  chunkTotalWidth width of a chunk in px
  chunkLength = numbers of tiles
  chunkTotalLength = total numbers of pixels in chunk
*/

class TileGame extends SpriteLayer {
  constructor(...args) {
    super(...args)

    this.chunkWidth = 16
    this.chunkHeight = 16
    this.tileWidth = 16
    this.chunks = []

    this.preW = this.preH = null
    this.postW = this.postH = null

    this.chunkLoader = this
  }

  get tileHeight() { return this.tileWidth }
  get chunkLength() { return this.chunkWidth * this.chunkHeight }
  get chunkTotalWidth() { return this.chunkWidth * this.tileWidth }
  get chunkTotalHeight() { return this.chunkHeight * this.tileWidth }
  get chunkTotalLength() { return this.chunkTotalWidth * this.chunkTotalHeight }

  fixedUpdateCapture() {
    this.forEachChunk(chunk => chunk.fixedUpdate())
  }

  updateCapture(sprite) {
    if (this.preW !== null) {
      const {chunkTotalWidth, chunkTotalHeight, preW, preH, postW, postH} = this

      // const xCenter = floor(-this.x / chunkTotalWidth)
      // const yCenter = floor(-this.y / chunkTotalHeight)
      const xCenter = floor(-this.sprite.center.x / chunkTotalWidth)
      const yCenter = floor(-this.sprite.center.y / chunkTotalHeight)

      // delete all outside chunk
      let deletedChunks = 0
      const minX = xCenter - postW, maxX = xCenter + postW
      const minY = yCenter - postH, maxY = yCenter + postH
      for (let x in this.chunks) {
        const col = this.chunks[x]

        for (let y in col) {
          if (x < minX || x > maxX || y < minY || y > maxY) {
            deletedChunks++
            this.unloadChunkAt(x, y)
          }
        }
      }

      // add new chunks
      let newChunks = 0
      for (let x = xCenter - this.preW; x <= xCenter + this.preW; x++) {
        for (let y = yCenter - this.preH; y <= yCenter + this.preH; y++) {
          if (!this.chunks[x] || !this.chunks[x][y]) {
            newChunks++
            this.loadChunkAt(this.chunkLoader.chunkLoader(x, y), x, y)
          }
        }
      }
    }

    this.forEachChunk((chunk, x, y) => {
      const updated = chunk.update()

      if (updated || chunk.changed) {
        this.changed = true
      }
    })

    return this.changed
  }

  getSpriteCapture() {
    this.forEachChunk((chunk, x, y) => {
      const {chunkTotalWidth, chunkTotalHeight} = this

      const sprite = chunk.getSprite(this.sprite)
      if (sprite) {
        this.image(sprite, x * chunkTotalWidth, y * chunkTotalHeight, {hitbox: debugEnabled, trusted: debugEnabled})
      } else if (sprite !== false) {
        console.error('Invalid chunk getSprite return?');
      }

      chunk.changed = false
    })
  }

  cord(...args) {
    args = args.map(val => floor(val / this.tileWidth))
    return args.length == 1 ? args[0] : args
  }

  forceChunkLoad(x, y) {
    this.loadChunkAt(this.chunkLoader.chunkLoader(x, y), x, y)
  }

  ChunkAtCord(...args) {
    args = args.map(val => floor(val / this.chunkTotalWidth))
    return args.length == 1 ? args[0] : args
  }

  ChunkAtTile(...args) {
    args = args.map(val => floor(val / this.chunkWidth))
    return args.length == 1 ? args[0] : args
  }

  chunkLoader() {
    throw new Error('Please define a chunkLoader function or use loadMap!!')
  }

  chunkOffloader() {

  }

  isOnMap(entity) {
    const {chunkTotalWidth, chunks} = this
    const x1 = floor(entity.left / chunkTotalWidth)
    const y1 = floor(entity.top / chunkTotalWidth)
    const x2 = ceil(entity.right / chunkTotalWidth) - 1
    const y2 = ceil(entity.bottom / chunkTotalWidth) - 1

    const it = this.chunkGen(x1, y1, x2, y2)
    let result = it.next()

    while (!result.done) {
      if (!result.value.chunk) {
        return false
      }

      result = it.next()
    }

    return true
  }

  forEachChunk(fun) {
    for (let x in this.chunks) {
      const col = this.chunks[x]

      for (let y in col) {
        fun(col[y], x, y)
      }
    }
  }

  setChunkLoader(...args) {
    args = args.map(val => floor(val))

    switch (args.length) {
      case 1:
        this.preW = this.preH = this.postH = this.postW = args[0]
        break;
      case 2:
        this.preW = this.preH = args[0]
        this.postW = this.postH = args[1]
        break;
      case 3:
        this.preW = args[0]
        this.preH = args[1]
        this.postW = this.postH = args[2]
        break;
      case 4:
        [this.preW, this.preH, this.postW, this.postH] = args
        break;
      default:
        throw new Error('Invalid setChunkLoader arguments...')
    }

    this.update()
  }

  loadChunkAt(json, chunkX, chunkY) {
    //create new chunk
    const chunk = new Chunk(this)
    if (chunkY % 1 != 0) {
      debugger
    }

    //create col if not present
    if (!this.chunks[chunkX]) this.chunks[chunkX] = []
    this.chunks[chunkX][chunkY] = chunk

    chunk.load(json.data)
    json.entities.forEach(({name, args}) => {
      switch (name) {
        case 'Furnace': this.addChild(new Furnace(args, chunk)); break;
        case 'CraftingTable': this.addChild(new CraftingTable(args, chunk)); break;
        case 'Drop': this.addChild(new Drop(args, chunk)); break;
        default: console.error(name);

      }


      // const key = name.toLowerCase()
      // if (!this.spawners[key]) {
      //   throw new Error(`failed to load map ${name}, ${key} spawner not found`)
      // }
      //
      // const entity = new this.spawners[key](chunk, data)
      // this.spawn(entity)
    })
  }

  unloadChunkAt(chunkX, chunkY) {
    if (!this.chunks[chunkX]) return -1
    if (!this.chunks[chunkX][chunkY]) return -1
    const chunk = this.chunks[chunkX][chunkY]

    const json = chunk.serialize()

    this.allEntitesInChunk(chunkX, chunkY).forEach(entity => {
      const serialized = entity.onUnloadedChunk()

      if (serialized) {
        entity.despawn()
        json.entities.push({name: entity.constructor.name, args: serialized})
      }
    })

    // delete chunk
    delete this.chunks[chunkX][chunkY]
    if (!Object.keys(this.chunks[chunkX]).length) {
      delete this.chunks[chunkX]
    }

    if (json.data.length || json.entities.length) {
      this.chunkLoader.chunkOffloader(json, chunkX, chunkY)
    }
  }

  tileAt(x, y) {
    //get chunk, cordinate
    const {chunkWidth, chunkHeight} = this
    const chunkX = floor(x / chunkWidth)
    const chunkY = floor(y / chunkHeight)

    const i = (y - chunkY * chunkHeight) * chunkWidth + (x - chunkX * chunkWidth)

    //chenk if chunx exists and is loaded
    if (!this.chunks[chunkX]) return 0
    if (!this.chunks[chunkX][chunkY]) return 0

    return this.chunks[chunkX][chunkY].tiles[i]
  }

  setTileAt(x, y, id) {
    //get chunk, cordinate
    const {chunkWidth, chunkHeight} = this
    const chunkX = floor(x / chunkWidth)
    const chunkY = floor(y / chunkHeight)
    const xc = x - chunkX * chunkWidth
    const yc = y - chunkY * chunkHeight

    //chenk if chunx exists and is loaded
    if (!this.chunks[chunkX]) return -1
    if (!this.chunks[chunkX][chunkY]) return -1

    const chunk = this.chunks[chunkX][chunkY]

    this.onBlockPlaced({id, x, y, chunk, xc, yc})

    return chunk.setTileAt(xc, yc, id)
  }

  onBlockPlaced() {

  }

  noEntityAt(x, y, w = this.tileWidth, h = this.tileWidth) {
    const it = this.children.entries()

    let result = it.next()
    while (!result.done) {
      if (result.value[0].collideWithMap && rectIsOnRect(result.value[0], {x: x * w, y: y * h, w, h})) {
        return false
      }

      result = it.next()
    }

    return true
  }

  allEntitesInChunk(x, y) {
    const w = this.chunkTotalWidth
    const it = this.children.entries()
    const ret = []

    let obj = it.next()
    while (!obj.done) {
      if (rectIsOnRect(obj.value[0], {x: x * w, y: y * w, w, h: w})) {
        ret.push(obj.value[0])
      }

     obj = it.next()
    }

    return ret
  }

  collideMap(entity, sides = 3) {
    const {w, h, tileWidth} = this

    if (!this.isOnMap(entity)) {
      return entity.onUnloadedChunk()
    }

    if (sides & 1) {
      // chex x-axis
      let topTile = floor(entity.top / tileWidth)
      const bottomTile = ceil(entity.bottom / tileWidth)

      if (entity.xv > 0) { // entity is going right
        const xTile = floor(entity.right / tileWidth)
        do {
          if (tiles[this.tileAt(xTile, topTile)].collision & 8) {
            entity.onBlockCollision({side: 'right', x: xTile, y: topTile, s: tileWidth})
          }
          topTile++
        } while (topTile < bottomTile)

      } else if (entity.xv < 0) { // entity is going left
        const xTile = floor(entity.left / tileWidth)
        do {
          if (tiles[this.tileAt(xTile, topTile)].collision & 2) {
            entity.onBlockCollision({side: 'left', x: xTile, y: topTile, s: tileWidth})
          }
          topTile++
        } while (topTile < bottomTile)
      }
    }

    if (sides & 2) {
      // chex y-axis
      let leftTile = floor(entity.left / tileWidth)
      const rightTile = ceil(entity.right / tileWidth)

      if (entity.yv > 0) { // entity is going down
        const yTile = floor(entity.bottom / tileWidth)
        do {
          if (tiles[this.tileAt(leftTile, yTile)].collision & 1) {
            entity.onBlockCollision({side: 'bottom', x: leftTile, y: yTile, s: tileWidth})
          }
          leftTile++
        } while (leftTile < rightTile)

      } else if (entity.yv < 0) { // entity is going up
        const yTile = floor(entity.top / tileWidth)
        do {
          if (tiles[this.tileAt(leftTile, yTile)].collision & 4) {
            entity.onBlockCollision({side: 'top', x: leftTile, y: yTile, s: tileWidth})
          }
          leftTile++
        } while (leftTile < rightTile)
      }
    }
  }

  loadMap(map) {
    if (Array.isArray(map)) map = {data: map}

    if (!map.width) map.width = 16
    if ((map.data.length / map.width) % 1 != 0) {
      console.error(map);
      throw new Error('Cannot load map, invalid measures...')
    }

    this.setChunkSize(map.width, map.data.length / map.width)

    this.clearChunks()
    this.loadChunkAt(map, 0, 0)
  }

  setChunkSize(w, h) {
    if (this.chunks.length) {
      throw new Error('Cannot change chunkSize while map is loaded')
    }

    if (!h) h = w

    this.chunkWidth = w
    this.chunkHeight = h
  }

  clearChunks(hard = false) {
    if (!hard) {
      this.forEachChunk((chunk, x, y) => {
        this.unloadChunkAt(x, y)
      })
    } else {
      this.chuks = []
    }
  }

  *tileGen(x1, y1, x2, y2) {
    const it = itGen(x1, y1, x2, y2)
    let result = it.next()

    while (!result.done) {
      const {x, y} = result.value
      yield {tile: this.tileAt(x, y), x, y}

      result = it.next()
    }
  }

  *chunkGen(x1, y1, x2, y2) {
    const it = itGen(x1, y1, x2, y2)
    let result = it.next()

    while (!result.done) {
      const {x, y} = result.value
      let chunk = null

      if (this.chunks[x] && this.chunks[x][y]) {
        chunk = this.chunks[x][y]
      }

      yield {chunk, x, y}

      result = it.next()
    }
  }
}

addCordMiddleware(TileGame, 'tileAt', 2)
addCordMiddleware(TileGame, 'setTileAt', 2)
addCordMiddleware(TileGame, 'noEntityAt', 2)

addChunkMiddleware(TileGame, 'forceChunkLoad', 2)

function* itGen(x1, y1, x2, y2) {
  let x = x1
  do {
    let y = y1
    do {
      yield {x, y}
      y++
    } while (y <= y2);
    x++
  } while (x <= x2);
}
