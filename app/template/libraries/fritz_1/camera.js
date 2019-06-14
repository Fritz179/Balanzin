class Camera extends Layer {
  constructor(parent) {
    super()

    this._status = parent
    this.layers = []

    this.toFollow = false
    this.multiplierX = this.multiplierY = 1
    this.cameraWidth = this.cameraHeight = 100
    this.mode = 'auto'
    this.overflow = 'display'
    this._toSmooth = false
  }

  getSprite(oldMouseX, oldMouseY, oldPmouseX, oldPmouseY) {
    //center the camera, move it in the right position
    this.centerFollower()

    const {x3, y3, multiplierX, multiplierY, graphic, layers} = this

    const newMouseX = this._status._cameraX = () => oldMouseX() / this._status.w1 * this.cameraWidth
    const newMouseY = this._status._cameraY = () => oldMouseY() / this._status.h1 * this.cameraHeight
    const newPmouseX = this._status._pcameraX = () => oldPmouseX() / this._status.w1 * this.cameraWidth
    const newPmouseY = this._status._pcameraY = () => oldPmouseY() / this._status.h1 * this.cameraHeight

    graphic.background(0)

    //draw every layer
    layers.forEach(layer => {
      const sprite = layer.getSprite(newMouseX, newMouseY, newPmouseX, newPmouseY)
      graphic.image(sprite, -x3 + layer.x3, -y3 + layer.y3)
    })

    return this.graphic
  }

  settings(settings = {}) {
    let {w, h, r, mode, overflow, smooth} = settings

    if (mode) this.mode = mode
    if (overflow) this.overflow = overflow

    if (w || h || r) {
      const camera = getCameraSize(w, h, r)
      if (camera.w) this.cameraWidth = camera.w
      if (camera.h) this.cameraHeight = camera.h
    }

    if (typeof smooth == 'boolean' && smooth != this._toSmooth) {
      this._toSmooth = smooth
      this.reSmooth()
    }

    this.resize()
  }

  reSmooth() {
    const smooth = this._toSmooth

    if (smooth) this.graphic.smooth()
    else this.graphic.noSmooth()

    this.layers.forEach(layer => {
      if (smooth) layer.graphic.smooth()
      else layer.graphic.noSmooth()
    })
  }

  centerFollower() {
    const {toFollow} = this

    if (toFollow) {
      const {x, y} = toFollow.center
      // this.center = {x: floor(x), y: floor(y)}
      this.center = {x: x, y: y}
    }
  }

  resize() {
    this.resizedGraphic = false

    const {cameraWidth, cameraHeight, mode, overflow, graphic} = this
    const {w, h} = this._status
    let multiplierX, multiplierY

    if (mode == 'multiple') {
      //if the camera is bigger then the status (multiplier >= 1)
      if (w >= cameraWidth && h >= cameraHeight) {
        multiplierX = (w - (w % cameraWidth)) / cameraWidth
        multiplierY = (h - (h % cameraHeight)) / cameraHeight
      } else { // if camera is smaller (multiplier < 1 => 0.5, 0.25, 0.125)
        multiplierX = 1 / 2 ** ((cameraWidth - (cameraWidth % w)) / w)
        multiplierY = 1 / 2 ** ((cameraHeight - (cameraHeight % h)) / h)
      }

      multiplierX = multiplierY = multiplierX < multiplierY ? multiplierX : multiplierY
    } else if (mode == 'auto') {
      multiplierX = w / cameraWidth
      multiplierY = h / cameraHeight
      multiplierX = multiplierY = multiplierX < multiplierY ? multiplierX : multiplierY
    } else if (mode == 'original') {
      multiplierX = multiplierY = 1
    } else if (mode == 'strech') {
      multiplierX = w / cameraWidth
      multiplierY = h / cameraHeight
    } else {
      console.error('CameraMode not multiple or auto or original or strech?');
    }

    this.multiplierX = multiplierX
    this.multiplierY = multiplierY

    if (overflow == 'hidden') {
      this.setSize(cameraWidth, cameraHeight)
      const marginX = round(w - cameraWidth * multiplierX)
      const marginY = round(h - cameraHeight * multiplierY)
      this._status.setDiff(marginX / 2, marginY / 2)
      this._status.setSpriteSize(w - marginX, h - marginY)
    } else if (overflow == 'display') {
      console.error('Display?');
      this.setSize(w, h)
      this._status.setDiff(0, 0)
      this.setSpriteSize(w, h)
    } else {
      console.error('Overflow not hidder or display?');
    }

    this.layers.forEach(layer => {
      layer.setSize(cameraWidth, cameraHeight)
    })

    this.reSmooth()
  }

  follow(e) {
    console.log('following', e);
    this.toFollow = e
  }

  addLayer(layer) {
    if (!(layer instanceof Layer)) throw new Error('Invalid Layer => it must extend Layer')

    layer._status = this._status
    layer.camera = this
    layer.setSize(this.w, this.h)

    if (this._toSmooth) layer.graphic.smooth()
    else layer.graphic.noSmooth()

    this.layers.push(layer)

    return layer
  }

  addBackgroundLayer(img) { return this.addLayer(new BackgroundLayer(img)) }
  addTileLayer() { return this.addLayer(new TileLayer(this)) }
  addSpriteLayer() { return this.addLayer(new SpriteLayer(this)) }
}

function getCameraSize(w, h, r) {

  //if alredy given
  if (w && h && r) {
    //if is alredy correct
    if (w / h == r) return {w, h, r}

    //else get the smalles and round it
    h * r > w ? h = round(w / r) : w = round(h * r)
    return {w, h}
  }

  if (w && h) r = w / h
  else if (w && r) h = w / r
  else if (h && r) w = h * r
  else throw new Error(`Not enought params for camera!`)

  return {w, h, r}
}
