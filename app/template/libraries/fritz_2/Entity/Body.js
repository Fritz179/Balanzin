class Body extends Frame {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this.vel = new velVec(0, 0)
    this.acc = new accVec(0, 0)
    this.drag = new dragVec(0, 0)

    this.speed = 5
    this.autoMove = true
    this.collideWithMap = false
    this.movingFor = 0
    this._minVel = 0.1

    this.lifeTime = Infinity
    this.attachments = [] // pointer to all things that have the pointer to this entity
                          // used when despawning

    createMiddleware(this, 'onBlockCollision')
    createMiddleware(this, 'onUnloadedChunk')
  }

  onBlockCollisionCapture(args) {
    args.solveCollision = () => {
      const {side, x, y, s} = args
      switch (side) {
        case 'top': this.y1 = (y + 1) * s; this.yv = 0; break;
        case 'right': this.x2 = x * s; this.xv = 0; break;
        case 'bottom': this.y2 = y * s; this.yv = 0; break;
        case 'left': this.x1 = (x + 1) * s; this.xv = 0; break;
        default: throw new Error('invalid collision side', side, x, y, s, this)
      }
    }
  }

  onUnloadedChunkCapture(args) {
    args.teleportToNearestChunk = () => {
      if (!Object.keys(this.layer.chunks).length) {
        return console.error('No chunk to teleport to!', this);
      }

      const [x, y] = this.layer.ChunkAtCord(...this.frame)

      const chunkX = Object.keys(this.layer.chunks)
        .reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);

      const chunkY = Object.keys(this.layer.chunks[chunkX])
        .reduce((prev, curr) => Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev);

      const w = this.layer.chunkTotalWidth
      const h = this.layer.chunkTotalHeight
      setRectInRect(this, {x: chunkX * w, y: chunkY * h, w, h})

      return true
    }

    args.forceChunkLoad = () => {
      const {x, y} = this.pos

      this.layer.forceChunkLoad.cord(x, y)
    }
  }

  fixedUpdateCapture(args) {
    if (sign(this.movingFor) == sign(this.xv)) {
      this.movingFor += this.xv
    } else {
      this.movingFor = this.xv
    }

    this.lifeTime--
    if (this.lifeTime <= 0) {
      this.despawn()
    }

    args.updatePhisics = () => {
      // add acceleration to velocity
      this.addVel(this.acc)

      //add drag to velocity
      this.xv *= this.xd
      this.yv *= this.yd
      if (abs(this.xv) < this._minVel) this.xv = 0
      if (abs(this.yv) < this._minVel) this.yv = 0

      if (this.collideWithMap && this.layer instanceof TileGame) {
        //check collsison for each axis
        this.x += this.xv
        this.layer.collideMap(this, 1)
        this.y += this.yv
        this.layer.collideMap(this, 2)
      } else {
        // add only velocity to position
        this.addPos(this.vel)
      }

    }
  }

  fixedUpdate({updatePhisics}) {
    updatePhisics()
  }

  onBlockCollision({solveCollision}) {
    solveCollision()
  }

  onUnloadedChunk({teleportToNearestChunk}) {
    if (!teleportToNearestChunk()){
      this.despawn()
    }
  }

  despawn() {
    this.attachments.forEach(attachment => {
      attachment.detach(this)
    })

    this.layer.deleteChild(this)
  }

  onEntityCollision({entity}) {

  }

  isOnGround() {
    if (!(this.layer instanceof TileGame)) {
      console.error(this, this.layer);
      throw new Error('Cannot be on gorund if parent layer is\'t TileGame')
    }

    const x1 = floor(this.x / 16)
    const x2 = ceil((this.x + this.w) / 16)
    const y = floor((this.y + this.h) / 16)

    let x = x1
    do {
      if (tiles[this.layer.tileAt(x, y)].collision & 1) {
        return true
      }
      x++
    } while (x < x2)

    return false
  }
}

const velVec = addVec2(Body, 'vel', 'xv', 'yv')
const accVec = addVec2(Body, 'acc', 'xa', 'ya')
const dragVec = addVec2(Body, 'drag', 'xd', 'yd')
