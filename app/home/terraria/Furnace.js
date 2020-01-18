class Furnace extends Body {
  constructor({x, y, xc, yc}, chunk) {
    super()
    this.location = {xc, yc}
    this.chunk = chunk
    chunk.attach(this)

    this.setPos(x * 16, y * 16)
    this.setSize(16, 16)
    this.setTrigger(-32, -32, 80, 80)
    this.lit = false
    this.wasLit = false
  }

  getSprite() {
    return false
  }

  fixedUpdate() {

    if (this.lit != this.wasLit) {
      const {xc, yc} = this.location

      if (this.chunk.tileAt(xc, yc) != (this.lit ? 9 : 10)) {
        this.despawn()
      } else {
        this.chunk.setTileAt(xc, yc, this.lit ? 10 : 9)
        this.wasLit = this.lit
      }
    }

    this.lit = false
  }

  onEntityCollision({name, entity}) {
    if (name == 'Player') {
      this.lit = true
      entity.nearFurnace = true
    }
  }

  serialize() {
    const {xc, yc} = this.location

    return {x: this.x / 16, y: this.y / 16, xc, yc}
  }
}

class CraftingTable extends Body {
  constructor({x, y, xc, yc}, chunk) {
    super()
    chunk.attach(this)

    this.setPos(x * 16, y * 16)
    this.xc = xc
    this.yc = yc
    this.chunk = chunk
    this.setSize(16, 16)
    this.setTrigger(-32, -32, 80, 80)
  }

  getSprite() {
    return false
  }

  onEntityCollision({name, entity}) {
    if (name == 'Player') {
      if (tiles[this.chunk.tileAt(this.xc, this.yc)].name != 'crafting_table') {
        this.despawn()
      } else {
        entity.nearCrafting = true
      }
    }
  }

  serialize() {
    return {x: this.x / 16, y: this.y / 16, xc: this.xc, yc: this.yc}
  }
}
