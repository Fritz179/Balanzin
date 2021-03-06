// class Entity extends Body {
//   constructor(x, y, w, h) {
//     super(x, y, w, h)
//
//     this.sprite = DEFAULT_TEXTURE
//     this._spriteAction = ''
//     this._spriteFrame = 0
//     this._spriteDir = 0
//     this.autoDir = false
//     this.autoWalk = 0
//     this.collideBorder = true
//   }
//
//   set spriteAction(action) {
//     if (this._spriteAction != action) {
//       this.changed = true
//       this._spriteAction = action
//     }
//   }
//
//   set spriteFrame(frame) {
//     if (this._spriteFrame != frame) {
//       this.changed = true
//       this._spriteFrame = frame
//     }
//   }
//
//   set spriteDir(dir) {
//     if (this._spriteDir != dir) {
//       this.changed = true
//       this._spriteDir = dir
//     }
//   }
//
//
//   get spriteAction() { return this._spriteAction }
//   get spriteFrame() { return this._spriteFrame }
//   get spriteDir() { return this._spriteDir }
//
//   setSprite() {
//     // use same ctxt (no RenderContext)
//   }
//
//   copySprite() {
//     // create new ctxt (no RenderContext)
//   }
//
//   updateBubble(status) {
//     if (this.autoDir && this.xv) {
//       this.spriteDir = this.xv > 0 ? 0 : 1
//     }
//
//     if (this.autoWalk) {
//       this.spriteFrame = this.movingFor / this.autoWalk
//     }
//   }
//
//   setSprite(sprite) {
//     this.changed = true
//
//     if (typeof sprite == 'string') {
//       if (!sprites[sprite]) console.error(`Invalid sprite: ${sprite}`);
//       this.sprite = sprites[sprite]
//     } else {
//       this.sprite = sprite
//     }
//   }
//
//   renderBubble(ctx, ret) {
//     if (typeof ret == 'undefined') {
//       if (Array.isArray(this.sprite)) {
//         if (!this.spriteAction) console.error('No sprite action', this);
//         if (Array.isArray(this.sprite[this.spriteAction])) {
//           const action = this.sprite[this.spriteAction]
//           if (Array.isArray(action)) {
//             if (Array.isArray(action[0])) {
//               const frame = action[floor(abs(this.spriteFrame % action.length))]
//               if (Array.isArray(frame)) {
//                 return frame[this.spriteDir]
//               } else {
//                 return frame
//               }
//             } else {
//               if (action.mirrored) {
//                 return action[this.spriteDir]
//               } else {
//                 return action[this.spriteFrame]
//               }
//             }
//           } else {
//             return action
//           }
//         } else {
//           return this.sprite[this.spriteAction]
//         }
//       } else if (ret !== false) {
//         return this.sprite
//       }
//     }
//   }
// }
//
// Object.defineProperty(Entity.prototype, 'sprite', {
//   get: function() {
//     console.error(this);
//     throw new Error('Cannot acces unexisting sprite')
//   },
//   set: function(value) {
//     Object.defineProperty(this, 'sprite', {value})
//   }
// })
class Entity extends Frame {
  constructor(...args) {
    super(...args)

    this.vel = [0, 0]
    this.acc = [0, 0]
    this.drag = [1, 1]

    this.pos.listen(() => this.changed = this.changed || !this.parentLayer.useHTML)

    this.container = document.createElement('div')

    this.minVel = 0.1
    this.minAcc = 0.001
  }

  createSprite() {
    const sprite = new Sprite(this.w, this.h)
    this.container.appendChild(sprite.canvas)
    return sprite
  }

  fixedUpdateBubble() {
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.vel.x *= this.drag.x
    this.vel.y *= this.drag.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y

    if (Math.abs(this.vel.x) < this.minVel) this.vel.x = 0
    if (Math.abs(this.vel.y) < this.minVel) this.vel.y = 0
  }

  updateBubble() {
    if (this.hasChangedPos || this.hasChangedBasePos) {
      // if both pos and scale have changed, the above statement cuts short
      // at the || and scale is't staganted

      const {style} = this.container
      const {scale, pos} = this
      style.transform = `matrix(1, 0, 0, 1, ${Math.floor(pos.x)}, ${Math.floor(pos.y)})`
    }

    return this.changed
  }
}

addVec2(Entity, 'vel', 'xv', 'yv')
addVec2(Entity, 'acc', 'xa', 'ya')
addVec2(Entity, 'drag', 'xd', 'yd')

createMiddleware(Entity, 'render')
