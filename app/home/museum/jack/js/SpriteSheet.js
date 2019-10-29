export default class SpriteSheet {
  constructor(bID) {
    this.bID = bID
    this.tiles = []
    this.animations = {}
  }

  drawTile(context, x, y, id) {
    //console.log(x, y, id);
    if (id) {
      context.drawImage(this.tiles[id], x, y)
    } else {
      context.drawImage(this.tiles[id], x, y)
    }
  }

  drawAnim(context, x, y, w, h, name, type, pos) {
    context.drawImage(this.animations[name][type][pos], x, y, w, h)
  }

  defineAll(definer, imgs) {
    if (definer.sprites) {
      definer.sprites.forEach(sprite => {
        let w = sprite.width
        let h = sprite.height
        let mw = imgs[sprite.name].width / w
        let img = imgs[sprite.name]
        if (sprite.normal) {
          sprite.tiles.forEach((block, i) => {
            let tile = block.name
            let x = i % mw
            let y = (i - x) / mw
            const buffer = document.createElement('canvas')
            buffer.width = w
            buffer.height = h
            buffer.getContext('2d').drawImage(img, x * w, y * h, w, h, 0, 0, w, h)
            this.tiles[this.bID.getID(tile)] = buffer
            console.log('Agiünt al id da ' + this.bID.getID(tile) + ' par ' + tile);
          })
        } else {
          console.warn("Erur da cumpatibiltà con Sprite");
        }
      })
    }
    if (definer.entities) {
      definer.entities.forEach(entity => {
        this.animations[entity.name] = {}
        let img = imgs[entity.name]
        entity.animations.forEach(animation => {
          this.animations[entity.name][animation.name] = []
          let l = animation.length
          let xs = animation.x
          let ys = animation.y
          let w = animation.w
          let h = animation.h
          for (let i = 0; i < l; i++) {
            const buffer = document.createElement('canvas')
            buffer.width = w
            buffer.height = h
            buffer.getContext('2d').drawImage(img, i * w + xs, ys, w, h, 0, 0, w, h)
            this.animations[entity.name][animation.name].push(buffer)
          }
          console.log("Agiünt l'animazion da " + entity.name + " par " + animation.name);
        })
      })
    }
    console.log(this);
  }
}
