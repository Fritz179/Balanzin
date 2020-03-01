class Inventory extends SpriteLayer {
  constructor() {
    super()

    this.setCameraMode({align: 'left-top', overflow: 'display'})

    this.cols = 9
    this.rows = 4
    this.slots = []

    this.setSize(this.cols * 80, this.rows * 80)
    this.setPos(16, 16)

    for (let i = 0; i < this.cols * this.rows; i++) {
      this.slots[i] = this.addChild(new Slot(this, i))
    }

    this.open = false
    this.furnaceOpen = false
    this.craftingOpen = false
    this.refresh()

    this.selected = 0
  }

  get selectedSlot() { return this.slots[this.selected] }

  setNearFurnace(near) {
    this.furnaceOpen = near
    this.refresh()
  }

  setNearCrafting(near) {
    this.craftingOpen = near
    this.refresh()
  }

  onKey({name}) {
    switch (name) {
      case 'e': this.open = !this.open; this.refresh(); break;
    }

    let int = parseInt(name)
    if (int && int <= this.cols) {
      this.setSelected(int - 1)
    }
  }

  setSelected(num) {
    this.selected = num
    main.pointer.changed = true
  }

  refresh() {
    if (this.open) {
      this.setChildren(this.slots)

      if (this.open) {
        let offset = 1
        const validRecipes = recipes.filter(({ingredients, result, from}) => {
          return this.hasRecipe(ingredients) && (!from || this[from + 'Open'])
        })

        if (validRecipes.length) {
          this.addChild(new CraftingLayer(validRecipes, this.rows + 1))
        }
      }
    } else {
      this.setChildren(this.slots.slice(0, this.cols))
    }


    this.changed = true
  }
  
  onWheelBubble({dir}) {
    let newSel = this.selected + dir

    if (newSel < 0) newSel = this.cols - 1
    if (newSel > this.cols - 1) newSel = 0

    this.setSelected(newSel)
  }

  add(_id, quantity = 1) {
    const {maxStack, id} = tiles[_id]
    const {hand} = main

    if (hand.id == id && quantity < maxStack) {
      const space = maxStack - hand.quantity

      if (quantity > space) {
        hand.quantity += space
        quantity -= space
      } else {
        hand.quantity += quantity

        if (this.open) {
          this.refresh()
        }

        return 0
      }
    }

    // check all existing slots
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i]

      if (slot.id == id && slot.quantity < maxStack) {
        const space = maxStack - slot.quantity

        if (quantity > space) {
          slot.quantity += space
          quantity -= space
        } else {
          slot.quantity += quantity

          if (this.open) {
            this.refresh()
          }

          return 0
        }
      }
    }

    // check for empty space
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i]

      if (slot.id == 0) {
        slot.id = id

        if (quantity > maxStack) {
          slot.quantity = maxStack
          quantity -= maxStack
        } else {
          slot.quantity = quantity

          if (this.open) {
            this.refresh()
          }

          return 0
        }
      }
    }

    if (this.open) {
      this.refresh()
    }

    return quantity
  }

  getFromSlot(slotNum, quantity = 1) {
    const slot = this.slots[slotNum]

    if (slot.quantity >= quantity) {
      slot.quantity -= quantity

      if (!slot.quantity) {
        for (let i = 0; i < this.slots.length; i++) {
          const candidate = this.slots[i]

          if (candidate == slot) {
            continue
          }

          if (candidate.id == slot.id) {
            slot.quantity = candidate.quantity
            candidate.quantity = 0
            candidate.id = 0

            break
          }
        }

        if (!slot.quantity) {
          slot.id = 0
        }
      }

      if (this.open) {
        this.refresh()
      }

      return quantity
    } else {
      console.error(`Cannot remove from empty slot!!`);
      return 0
    }
  }

  remove(id, count = 1) {
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i]

      if (slot.id == id) {
        if (slot.quantity >= count) {
          slot.remove(count)
          return
        } else {
          count -= slot.quantity
          slot.empty()
        }
      }
    }

    if (main.hand.id == id) {
      if (main.hand.quantity >= count) {
        main.hand.remove(count)
        return
      } else {
        count -= main.hand.quantity
        slot.empty()
      }
    }

    // return the ammount that wasn't removed
    return count
  }

  has(id, quantity) {
    let found = 0

    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i]

      if (slot.id == id) {
        found += slot.quantity

        if (found >= quantity) {
          return true
        }
      }
    }

    if (main.hand.id == id) {
      found += main.hand.quantity

      if (found >= quantity) {
        return true
      }
    }

    return false
  }

  hasRecipe(recipe) {
    if (!Array.isArray(recipe)) {
      recipe = [recipe]
    }

    return recipe.every(item => {
      const {quantity} = item
      const id = tiles[item.name].id

      return this.has(id, quantity)
    })
  }
}

// main.addChild(new Drop(x + this.w / 2, y + this.h / 2, tiles[tiles[tile].drop].id))
