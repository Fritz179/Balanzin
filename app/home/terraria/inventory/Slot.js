class Slot extends ItemHolder {
  constructor(inventory, num) {
    super(sprites.slot.slot[0])

    const x = num % inventory.cols
    const y = (num - x) / inventory.cols

    this.setPos(x * 80 + 8, y * 80 + 8)
    this.setSize(64, 64)

    this.triggerBox.set(-8, -8, 80, 80)

    this.inventory = inventory
    this.num = num

    this.oldSelected = false
    this.leftTime = 0
  }

  get changed() { return this.id != this.oldId || this.quantity != this.oldQuantity || this.selected != this.oldSelected }
  set changed(bool) { }

  get selected() { return this.inventory.selected == this.num }

  onLeftClick({stopPropagation, x, y}) {
    const {hand} = main

    if (hand.isEmpty && !this.isEmpty) { // pickUp
      this.dump(hand)

      hand.from = this
      this.leftTime = 0
    } else if (!hand.isEmpty && (this.isEmpty || this.id == hand.id)) { // released
      this.getFrom(hand)
    }

    stopPropagation()
  }

  onClickUp() {
    this.onMouseReleased()
  }

  onMouseReleased() {
    const {hand} = main

    if (!hand.isEmpty) {
      if (this.isEmpty && this.leftTime > 20) {
        this.getFrom(hand)
      } else if (hand.id && hand.id == this.id) {
        const space = tiles[this.id].maxStack - this.quantity

        if (hand.quantity > space) {
          this.quantity += space
          hand.quantity -= space
        } else {
          this.quantity += hand.quantity
          hand.empty()
        }
      }
    }
  }

  update() {
    this.leftTime++
  }

  getSprite() {
    if (this.changed) {
      this.oldId = this.id
      this.oldQuantity = this.quantity
      this.oldSelected = this.selected

      this.image(sprites.slot.slot[this.selected ? 1 : 0], this.x, this.y, 64, 64)

      this.textFont('consolas')
      this.textAlign('right', 'bottom')

      if (this.id) {
        this.textSize(32)
        this.image(tiles[this.id].sprite, this.x + 16, this.y + 16, 32, 32)

        if (tiles[this.id].maxStack > 1) {
          this.text(this.quantity, this.x + 54, this.y + 64)
        }
      }

      if (this.num < this.inventory.cols) {
        this.textSize(16)
        this.text(this.num + 1, this.x + 57, this.y + 22)
      }
    }

    return this.sprite
  }
}
