class Hand extends ItemHolder {
  constructor() {
    super()

    this.mouse = new ChangeVec(0, 0)
    this.placing = false

    this.from = null
  }

  get changed() { return this.id != this.oldId || this.quantity != this.oldQuantity || this.mouse.changed }
  set changed(bool) { }

  fixedUpdate() {
    const {pointer, player} = main

    if (this.placing && !pointer.tile && !pointer.overEntity) {
      const {selected, selectedSlot} = player.inventory

      if (this.id && tiles[this.id].collision !== null) {
        pointer.tile = this.id
        this.remove()
      } else if (selectedSlot.id && tiles[selectedSlot.id].collision !== null) {
        pointer.tile = selectedSlot.id
        player.inventory.getFromSlot(selected, 1)
      }
    }
  }

  onRightMouseBubble() {
    this.placing = true
  }

  onRightMouseUp() {
    this.placing = false
  }

  onLeftMouseBubble() {
    if (this.id) {
      const {id, quantity} = this

      this.empty()
      main.player.inventory.add(id, quantity)
    }
  }

  onDrag({x, y}) {
    this.mouse.set(x, y)
  }

  getSprite(ctx) {
    this.oldId = this.id
    this.oldQuantity = this.quantity

    const [x, y] = this.mouse

    if (this.id) {
      ctx.textFont('consolas')
      ctx.textAlign('right', 'bottom')
      ctx.textSize(32)
      ctx.image(tiles[this.id].sprite, x - 16, y - 16, 32, 32)

      if (tiles[this.id].maxStack > 1) {
        ctx.text(this.quantity, x + 37, y + 32)
      }
    }

    return false
  }
}
