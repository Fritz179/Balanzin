import HTMLDiv from '/libraries/fritz_4/traits/HTMLDiv.js'
import {Canvas} from '/libraries/fritz_4/traits/Sprite.js'
import Entity from '/libraries/fritz_4/Entity.js'

import {CHUNK_TILE_SIZE, CHUNK_SIZE, TILE_SIZE, TILES} from './settings.js'

function randomChunk() {
  const arr = []

  for (let i = 0; i < CHUNK_SIZE ** 2; i++) {
    arr[i] = Math.floor(Math.random() * TILES.length)
  }

  return arr
}

class Chunk extends Canvas {
  constructor(data) {
    super(CHUNK_TILE_SIZE, CHUNK_TILE_SIZE)
    this.changed = true
    this.data = data

    this.canvas = document.createElement('canvas')
    this.canvas.width = CHUNK_TILE_SIZE
    this.canvas.height = CHUNK_TILE_SIZE
    this.ctx = this.canvas.getContext('2d')
  }

  render() {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let y = 0; y < CHUNK_SIZE; y++) {
        const i = y * CHUNK_SIZE + x

        this.ctx.fillStyle = TILES[this.data[i]]
        this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      }
    }

    this.changed = false
  }
}

class ChunkHolder extends Map {
  constructor(master) {
    super()

    master.chunks = this

    master.events.listen('render', () => {
      this.forEach(chunk => {
        if (chunk.changed) {
          chunk.render()
        }
      })
    })

    this.master = master
  }

  load(x, y) {
    const chunkName = `${x}_${y}`
    const chunk = new Chunk(randomChunk(255))

    chunk.canvas.id = name
    this.master.div.appendChild(chunk.canvas)
    chunk.canvas.style.left = x * CHUNK_TILE_SIZE + 'px'
    chunk.canvas.style.top = y * CHUNK_TILE_SIZE + 'px'
    this.set(chunkName, chunk)
  }
}

export default class TileLayer extends Entity {
  register(listen, master) {
    this.addTrait(HTMLDiv)
    this.addTrait(ChunkHolder)

    this.colliders = new Set()

    master.events.listen('addTileCollider', this.addTileCollider.bind(this))
    listen('update')

    this.chunks.load(1, 1)
    this.chunks.load(1, 2)
    this.chunks.load(2, 1)

    this.div.style.transform = `scale(2)`
  }

  addTileCollider(entity) {
    this.colliders.add(entity)
  }

  update() {
    // console.log(this.colliders);
  }
}
