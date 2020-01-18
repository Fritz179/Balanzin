class CraftingLayer extends SpriteLayer {
  constructor(recipes, row) {
    super()

    this.y = row * 80
    this.scrollPos = 0
    this.scrollView = 10

    this.recipes = []
    recipes.forEach(({ingredients, result}, i) => {
      this.recipes.push(new CraftingSlot(ingredients, result))
    })

    const w = Math.max(...this.recipes.map(el => el.w))
    this.setSize(w, Math.min(this.recipes.length, this.scrollView) * 80)

    this.refresh()
  }

  onWheel({dir, stopPropagation}) {
    if (this._hovered) {
      this.scrollPos += dir

      this.scrollPos = constrain(this.scrollPos, 0, this.recipes.length - 10)
      this.refresh()

      stopPropagation()
    }
  }

  refresh() {
    this.setChildren(this.recipes.slice(this.scrollPos, this.scrollPos + this.scrollView))
    this.children.CraftingSlot.forEach((slot, i) => {
      slot.y = i * 80
    });
  }
}

class CraftingSlot extends SpriteLayer {
  constructor(ingredients, result, y) {
    super('auto')

    this.setCameraMode({align: 'left-top'})
    this.ingredients = ingredients
    this.result = result
    this.clicked = false

    this.setSize((ingredients.length + result.length + 1) * 80, 80)
  }

  onResize() {

  }

  onClick({stopPropagation}) {
    this.clicked = true

    stopPropagation()
  }

  onClickUp() {
    if (this.clicked) {
      this.clicked = false

      this.ingredients.forEach(({name, quantity}) => {
        main.player.inventory.remove(tiles[name].id, quantity)
      })

      this.result.forEach(({name, quantity}) => {
        main.player.inventory.add(tiles[name].id, quantity)
      })
    }
  }

  getSprite() {
    // this.background(0)
    const ing = this.ingredients.length
    const res = this.result.length

    for (let i = 0; i < ing; i++) {
      const x = i * 80

      if (i == 0) {
        this.image(sprites.slot.start[0], x + 0, 0, 20, 80)
      } else {
        this.image(sprites.slot.junction[1], x + 0, 0, 20, 80)
      }

      this.image(sprites.slot.middle[0], x + 20, 0, 40, 80)
      this.image(sprites.slot.junction[0], x + 60, 0, 20, 80)

      const {name, quantity} = this.ingredients[i]
      this.textFont('consolas')
      this.textAlign('right', 'bottom')

      this.textSize(32)
      this.image(tiles[name].sprite, x + 24, 24, 32, 32)

      if (tiles[name].maxStack > 1) {
        this.text(quantity, x + 62, 72)
      }
    }

    // arrow
    this.image(sprites.slot.arrow[0], ing * 80, 0, 80, 80)


    for (let i = 0; i < res; i++) {
      const x = (i + ing + 1) * 80

      this.image(sprites.slot.junction[1], x + 0, 0, 20, 80)
      this.image(sprites.slot.middle[0], x + 20, 0, 40, 80)

      if (i == res - 1) {
        this.image(sprites.slot.start[1], x + 60, 0, 20, 80)
      } else {
        this.image(sprites.slot.junction[0], x + 60, 0, 20, 80)
      }

      const {name, quantity} = this.result[i]
      this.textFont('consolas')
      this.textAlign('right', 'bottom')

      this.textSize(32)
      this.image(tiles[name].sprite, x + 24, 24, 32, 32)

      if (tiles[name].maxStack > 1) {
        this.text(quantity, x + 62, 72)
      }
    }
  }
}
