class Menu extends Status {
  constructor() {
    super()

    if (this.sprite.main) this.camera.addBackgroundLayer(this.sprite.main)
    this.camera.addSpriteLayer()

    if (this.sprite.json) {
      const {buttons} = this.sprite.json
      for (key in buttons) {
        this.createButton(key, buttons[key])
      }
    }
  }

  createButton(name, cord) {
    this.addButton(new Button(name).setCord(cord))
  }

  addButton(button) {
    this.ecs.spawn(button)
  }
}

class Button extends Entity {
  constructor(_onClick) {
    super()
    this.listen('onClick')
    this._onClick = _onClick
  }

  onClick() {
    //if _onClick is a function, call it, else if it is a string and the status exist, set it as the currentStatus
    if (typeof this._onClick == 'function') this._onClick()
    else if (typeof this._onClick == 'string') setCurrentStatus(this._onClick)
  }

  getSprite() {
    return false
  }
}

p5.prototype.Menu = Menu
p5.prototype.Button = Button
