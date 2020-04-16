class Entity extends Body {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this.sprite = DEFAULT_TEXTURE
    this._spriteAction = ''
    this._spriteFrame = 0
    this._spriteDir = 0
    this.autoDir = false
    this.autoWalk = 0
    this.collideBorder = true
  }

  set spriteAction(action) {
    if (this._spriteAction != action) {
      this.changed = true
      this._spriteAction = action
    }
  }

  set spriteFrame(frame) {
    if (this._spriteFrame != frame) {
      this.changed = true
      this._spriteFrame = frame
    }
  }

  set spriteDir(dir) {
    if (this._spriteDir != dir) {
      this.changed = true
      this._spriteDir = dir
    }
  }


  get spriteAction() { return this._spriteAction }
  get spriteFrame() { return this._spriteFrame }
  get spriteDir() { return this._spriteDir }

  setSprite() {
    // use same ctxt (no RenderContext)
  }

  copySprite() {
    // create new ctxt (no RenderContext)
  }

  updateBubble(status) {
    if (this.autoDir && this.xv) {
      this.spriteDir = this.xv > 0 ? 0 : 1
    }

    if (this.autoWalk) {
      this.spriteFrame = this.movingFor / this.autoWalk
    }
  }

  setSprite(sprite) {
    this.changed = true

    if (typeof sprite == 'string') {
      if (!sprites[sprite]) console.error(`Invalid sprite: ${sprite}`);
      this.sprite = sprites[sprite]
    } else {
      this.sprite = sprite
    }
  }

  renderBubble(ctx, ret) {
    if (typeof ret == 'undefined') {
      if (Array.isArray(this.sprite)) {
        if (!this.spriteAction) console.error('No sprite action', this);
        if (Array.isArray(this.sprite[this.spriteAction])) {
          const action = this.sprite[this.spriteAction]
          if (Array.isArray(action)) {
            if (Array.isArray(action[0])) {
              const frame = action[floor(abs(this.spriteFrame % action.length))]
              if (Array.isArray(frame)) {
                return frame[this.spriteDir]
              } else {
                return frame
              }
            } else {
              if (action.mirrored) {
                return action[this.spriteDir]
              } else {
                return action[this.spriteFrame]
              }
            }
          } else {
            return action
          }
        } else {
          return this.sprite[this.spriteAction]
        }
      } else if (ret !== false) {
        return this.sprite
      }
    }
  }
}
