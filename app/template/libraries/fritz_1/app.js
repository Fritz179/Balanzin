let _preFunction = () => { }, _postFunction = () => { }, preStatusUpdate = new Set(), postStatusUpdate = new Set()
let debugEnabled = false, status, currentStatus, statuses = {}, resizingCamera = true
let masterStatus

//add new function for all canvases, grapchics and video
p5.prototype.rImage = function (img, ...pos) {

  //get array of positions, map them to round
  //resume normal function call
  this.image(img, ...pos.map(p => round(p)))
}

p5.prototype.rRect = function (...pos) {
  this.rect(...pos.map(p => round(p)))
}

p5.prototype.rLine = function (...pos) {
  this.line(...pos.map(p => round(p)))
}

p5.prototype.rPoint = function (...pos) {
  this.point(...pos.map(p => round(p)))
}


//init => called after p5 constructor and before preload
p5.prototype.registerMethod('init', () => {
  console.log('init');
  //keep a reference to the users function
  const setupCopy = window.setup || (() => { throw new Error('function setup is not defined') })
  const drawCopy = window.draw || (() => { })

  //modify setup function
  window.setup = () => {
    p5.prototype.sprites.defaultTexture = createDefaultTexture()
    createCanvas(windowWidth, windowHeight).parent('screen');

    masterStatus = new MasterStatus()

    window.cameraSettings = settings => {
      if (typeof settings.smooth == 'boolean') {
        if (settings.smooth) smooth()
        else noSmooth()
      }
      masterStatus.cameraSettings(settings)
    }

    //call users setup
    setupCopy()

    //set function to be always called before draw
    _preFunction = () => {
      if (resizingCamera) return resizingCamera = false

      preStatusUpdate.forEach(fun => fun())

      masterStatus._fixedUpdate()
      masterStatus._update()

      background(debugEnabled ? 51 : 0)

      const sprite = masterStatus.getSprite(() => mouseX, () => mouseY, () => pmouseX, () => pmouseY)
      const {x3, y3, x4, y4} = masterStatus

      rImage(sprite, x3, y3)

      postStatusUpdate.forEach(fun => fun())
    }

    //restore draw function
    window.draw = drawCopy

    _postFunction = () => { }
  }

  //clear draw function, else is called in creteCanvas and setup is not finished
  window.draw = () => { }
});

//pre => called always before draw, post => after draw
p5.prototype.registerMethod('pre', () => { _preFunction() });
p5.prototype.registerMethod('post', () => { _postFunction() });

//resize camera of current status if window is resized
window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
  masterStatus.setSize(windowWidth, windowHeight)
}

//helper function, like object.assign but assign only if undefined in target
function addDefaultOptions(target, source) {
  for (let key in source) {
    if (typeof target[key] == 'undefined') {
      target[key] = source[key]
    }
  }
  return target
}

//helper function, like
function setDefaultOptions(target, source) {
  console.log('setDefaultOptions called!!');
  for (let key in source) {
    if (typeof target[key] != 'undefined') {
      target[key] = source[key]
    } else {
      console.warn(`cannot change default source, invalid key: ${key} of: `, source);
    }
  }
  return target
}

function deCapitalize(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function createDefaultTexture() {
  let g = createGraphics(256, 256)
  g.noSmooth()
  g.noStroke()
  g.fill(0)
  g.rect(0, 0, 128, 128)
  g.rect(128, 128, 256, 256)
  g.fill(255, 0, 255)
  g.rect(128, 0, 256, 128)
  g.rect(0, 128, 128, 256)
  return g
}
