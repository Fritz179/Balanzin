class Player extends Entity {
  constructor(x, y) {
    super(x, y)
    this.setSize(15, 24)
    this.setSprite('player')

    this.spriteAction = 'idle'
    this.speed = 0.7
    this.autoDir = true
    this.autoWalk = 12
    this.collideWithMap = true

    this.setDrag(0.85, 0.99).setAcc(0, 0.25)

    this.breakBlock = false
    this.createNew = false
    this.jumpRequest = 0
    this.creative = false
    this.inventory = null
    this.nearFurnace = false
    this.wasNearFurnace = false
    this.nearCrafting = false
    this.wasNearCrafting = false

    this.setGamemode(true)
  }

  fixedUpdate({updatePhisics}) {
    updatePhisics()

    if (this.createNew) {
      this.createNew = false
      this.layer.addChild(new Player(this.x + random(-100, 100), this.y + random(-100, 100)))
    }

    if (this.creative) {
      if (this.jumpRequest) {
        this.yv = -5
      }
    } else {
      if (this.jumpRequest > 0) {
        this.jumpRequest--

        if (this.isOnGround()) {
          this.jumpRemanining = 10
          this.yv = -3.5
        }
      }

      if (this.jumpRemanining) {
        this.jumpRemanining--

        if (this.jumpRemanining < 6) {
          this.yv = -4 * (1 + this.jumpRemanining / 180)
        }
      }
    }

    if (this.nearFurnace != this.wasNearFurnace) {
      this.wasNearFurnace = this.nearFurnace
      main.player.inventory.setNearFurnace(this.nearFurnace)
    }
    this.nearFurnace = false

    if (this.nearCrafting != this.wasNearCrafting) {
      this.wasNearCrafting = this.nearCrafting
      main.player.inventory.setNearCrafting(this.nearCrafting)
    }
    this.nearCrafting = false
  }

  onEntityCollision({name, entity}) {
    if (name == 'Drop') {
      if (entity.pickupTime < 0 && this.inventory) {
        this.inventory.add(entity.id, entity.quantity)
        entity.despawn()
      }
    }
  }

  setGamemode(survival) {
    this.creative = !survival
    this.speed = survival ? 0.7 : 1.4

    if (this.xa) this.xa = this.speed * sign(this.xa)
  }

  getSprite() {
    if (this.yv || !this.isOnGround()) {
      this.spriteAction = 'jump'
      if (abs(this.yv) <= 7) {
        this.spriteFrame = 1
      } else {
        this.spriteFrame = this.yv > 0 ? 0 : 2
      }
    } else {
      this.spriteAction = abs(this.movingFor) > 1 ? 'run' : 'idle'
    }
  }

  cancelJump() {
    this.jumpRequest = this.creative ? 0 : 2
    this.jumpRemanining = 0
    this.ya = 0.25
  }

  onBlockCollision({x, y, solveCollision}) {
    if (this.breakBlock) {
      this.layer.setTileAt(x, y, 0)
    } else {
      solveCollision()
    }
  }

  onKey({name}) {
    switch (name) {
      case 'left': this.xa -= this.speed; break;
      case 'right': this.xa += this.speed; break;
      case 'p': console.log(`x: ${round(this.x)}, y: ${round(this.y)}`); break;
      case 'x': this.collideWithMap = !this.collideWithMap; break;
      case 'c': this.breakBlock = !this.breakBlock; break;
      case 'n': this.createNew = true; break;
      case 'b': this.explode(5, 5); break;
      case 'y': this.explode(50, 10); break;
      case ' ': this.jumpRequest = Infinity; break;
      case 'g': this.setGamemode(this.creative); break;
      case 'j': this.yv = -15; break;
    }
  }

  onKeyUp({name}) {
    switch (name) {
      case 'left': this.xa += this.speed; break;
      case 'right': this.xa -= this.speed; break;
      case ' ': this.cancelJump(); break;
    }
  }

  explode(w, h) {
    for (let x = -w + 1; x < w + 1; x++) {
      for (let y = -h + 1; y < h + 1; y++) {
        this.layer.setTileAt.cord(this.x + x * 16, this.y + y * 16, 0)
      }
    }
  }

  onUnloadedChunk({forceChunkLoad}) {
    if (this == main.player) {
      forceChunkLoad()
    } else {
      this.despawn()
    }
  }
}
