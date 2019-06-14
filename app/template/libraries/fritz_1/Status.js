class Status extends Layer {
  constructor(statusName) {
    super()
    this.preFunctions = []
    this.postFunctions = []
    this.updateFunctions = []
    this.fixedUpdateFunctions = []

    //get statusName and if a menuSprite was already loaded, add a reference to it
    this.statusName = deCapitalize(this.constructor.name)
    this.sprite = menuSprites[this.statusName] || {}

    this.listener = new Listener()
    this.camera = new Camera(this)
    this.ecs = new ECS(this)

    this.spawn = this.ecs.spawn

    this._mouseX = this._mouseY = this._pmouseX = this._pmouseY = 0

    this.cameraSettings({w : 1920, h: 1080, mode: 'auto', overflow: 'hidden'})
    this.setSize(1920, 1080)
  }

  get cameraX() { return this._cameraX() || 0 }
  get cameraY() { return this._cameraY() || 0 }
  get pcameraX() { return this._pcameraX() || 0 }
  get pcameraY() { return this._pcameraY() || 0 }

  _cameraX() { }
  _cameraY() { }
  _pcameraX() { }
  _pcameraY() { }

  pre() { }
  post() { }
  update() { }
  fixedUpdate() { }

  addPreFunction(fun) { this.preFunctions.push(fun) }
  addPostFunction(fun) { this.postFunctions.push(fun) }
  addUpdateFunction(fun) { this.updateFunctions.push(fun) }
  addFixedUpdateFunction(fun) { this.fixedUpdateFunctions.push(fun) }

  _pre(...args) { this.preFunctions.forEach(fun => fun(...args)); this.pre(...args) }
  _post(...args) { this.postFunctions.forEach(fun => fun(...args)); this.post(...args) }
  _update() { this.updateFunctions.forEach(fun => fun()); this.ecs.update(); this.update();}
  _fixedUpdate() { this.fixedUpdateFunctions.forEach(fun => fun()); this.ecs.fixedUpdate(); this.fixedUpdate(); }

  cameraSettings(settings) { this.camera.settings(settings) }

  getSprite(oldMouseX, oldMouseY, oldPmouseX, oldPmouseY) {
    if (this.resizedGraphic) {
      this.camera.resize()
      this.resizedGraphic = false
    }

    // const newRealX = x => x / this.camera.cameraWidth * this.w3 + this.x3
    // const newRealY = y => y / this.camera.cameraHeight * this.h3 + this.y3
    const newMouseX = this._mouseX = () => (oldMouseX() - this.x3) * this.w1 / this.w3
    const newMouseY = this._mouseY = () => (oldMouseY() - this.y3) * this.h1 / this.h3
    const newPmouseX = this._pmouseX = () => (oldPmouseX() - this.x3) * this.w1 / this.w3
    const newPmouseY = this._pmouseY = () => (oldPmouseY() - this.y3) * this.h1 / this.h3

    // this._getRealX = x => newRealX(x)
    // this._getRealY = y => newRealY(y)
    // this.pmouseX = this.mouseX
    // this.pmouseY = this.mouseY
    // this.mouseX = newMouseX
    // this.mouseY = newMouseY

    // console.log(newMouseX, newMouseY);
    const sprite = this.camera.getSprite(newMouseX, newMouseY, newPmouseX, newPmouseY)

    //if the canvas alredy has the rigth dimensions, just return it
    //otherwise draw it on the port
    if (sprite.width == this.w3 && sprite.height == this.h3) {
      return sprite

    } else {
      //draw and return it
      this.graphic.rImage(sprite, 0, 0, this.w3, this.h3)
    }
    return this.graphic
  }
}

// status.x1 | .y1 => box on screen (top, left)
// status.x2 | .y2 => box on screen (bottom, right)
// status.x3 | .y3 => draw on screen
// status.x4 | .y4 => draw on screen

// status.w1 | .h1 => box on screen (widht, height)
// status.w2 | .h2 => diff on screen (xDiff, yDiff)
// status.w3 | .h3 => draw on screen (widht, height)


// camera.x1 | .y1 => pos in world
// camera.x2 | .y2 => pos in world
// camera.x3 | .y3 => pos in view (unused)
// camera.x4 | .y4 => pos in view (unused)

// camera.w1 | h1 => box in world
// camera.w2 | h2 => diferenza nal draw (?)
// camera.w3 | h3 => ? nal draw (?)
