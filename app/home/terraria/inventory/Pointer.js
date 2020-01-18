class Pointer extends Canvas {
  constructor() {
    super()

    this.spriteAction = 'idle'

    this.oldDiggingFor = 0
    this.diggingFor = 0
    this.digging = false
    this.offset = new Vec2(0, 0)

    this.pTileX = 0
    this.pTileY = 0
  }

  get tile() { return this.layer.tileAt.cord(this.x, this.y) }
  get tilePos() { return this.layer.cord(this.x, this.y) }
  get tileCord() { return this.tilePos.map(pos => pos * 16) }
  get overEntity() { return !this.layer.noEntityAt.cord(this.x, this.y) }

  get x() { return this.offset.x - main.sprite.x }
  get y() { return this.offset.y - main.sprite.y }

  set tile(id) { this.layer.setTileAt.cord(this.x, this.y, id) }

  fixedUpdate() {
    const [x, y] = this.tilePos

    if (this.pTileX != x || this.pTileY != y) {
      this.pTileX = x
      this.pTileY = y

      this.diggingFor = 0
      this.changed = true
    }

    const tile = this.tile

    if (tile < 1) {
      this.spriteAction = 'clear'
      this.diggingFor = 0
    } else {
      if (this.digging) {
        this.diggingFor++
        this.spriteAction = 'digging'

        const miner = main.player.inventory.selectedSlot.id

        if (this.diggingFor >= this.diggingTime(tile, miner)) {
          this.diggingFor = this.diggingTime(tile, miner)

          if (tiles[main.player.inventory.selectedSlot.id].toolLevel >= tiles[tile].miningLevel) {
            const [x, y] = this.tileCord
            main.addChild(new Drop({x: x + this.w / 2, y: y + this.h / 2, id: tiles[tiles[tile].drop].id}))
          }

          this.tile = 0
        }

        this.spriteFrame = ceil(6 * this.diggingFor / this.diggingTime(tile, miner)) - 1
      } else {
        this.spriteAction = 'idle'
      }
    }
  }

  update() {
    return this.digging
  }

  diggingTime(miningID, minerID) {
    if (main.player.creative) return 1

    const mining = tiles[miningID]
    const miner = tiles[minerID]

    if (miner && miner.toolType == mining.weakness) {
      return mining.hardness / [1, 2, 4, 6, 8][miner.toolLevel]
    }

    return mining.hardness

    throw new Error(`Invalid digging tile: ${tile}`)
  }

  onMouseBubble({button}) {
    if (button == 0) {
      this.digging = true
    }
  }

  onClickBubble({button}) {
    if (button == 0) {
      this.digging = true
    }
  }

  onClickUp() {
    this.digging = false
  }

  onClickReleased() {
    this.onClickUp()
  }

  getSprite(ctx) {
    if (this.spriteAction != 'clear' && this.tile) {

      let tool = 1
      const miner = tiles[main.player.inventory.selectedSlot.id]
      const mining = tiles[this.tile]

      if (mining.miningLevel) {
        if (miner && miner.toolLevel >= mining.miningLevel && miner.toolType == mining.weakness) {
          tool = 2
        } else {
          tool = 0
        }
      } else if (miner.toolType == mining.weakness) {
        tool = 2
      }

      ctx.image(sprites.pointer.tools[tool], ...this.tileCord)

      if (this.spriteAction != 'idle') {
        ctx.image(sprites.pointer.breaking[this.spriteFrame], ...this.tileCord)
      }
    }

    return false
  }

  onUnloadedChunk() {
    return false
  }
}
