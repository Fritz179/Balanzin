let debugEnabled = false
let allowRepeatedKeyPressed = false
let mouseIsClicked = 0
let mouseX = -1, mouseY = -1
const mouseDirs = ['Left', 'Middle', 'Right', '']

// TODO: add names...
const names = {
  w: 'up',
  ArrowUp: 'up',
  d: 'right',
  ArrowRight: 'right',
  s: 'down',
  ArrowDown: 'down',
  a: 'left',
  ArrowLeft: 'left',
  Insert: 0,
}

const downKeys = {}
function isDown(key) { // global
  return downKeys[key]
}

//save a reference for each crawling function
const crawlers = {}
function createCrawler(eventName, allowed = () => true) { // global
  //move crawling parameters in this scope

  // flag for stopPropagation and preventDefault
  let bubbleCancelled = false
  let preventDefault = false
  let toBubble = []

  let stoppers = {
    stopPropagation: () => bubbleCancelled = true,
    preventDefault: () => preventDefault = true
  }

  function crawl(target, args, parent) {
    const wasAllowed = allowed(target, args, parent)
    if (wasAllowed) {
      target[eventName](args)
    }

    if (typeof target.forEachChild == 'function') {
      target.forEachChild(child => {
        crawl(child, Object.assign({}, args, stoppers), target)
      })
    }

    if (wasAllowed) {
      toBubble.push({target, args})
    }
  }

  // save global reference
  crawlers[eventName] = (target, args) => {
    if (preloadCounter == 0) {

      // reset falgs
      bubbleCancelled = false
      preventDefault = false
      crawl(target, args, target) // parent == target

      if (!bubbleCancelled) {
        toBubble.forEach(({target, args}) => {
          target[`${eventName}Bubble`](Object.assign({}, args))
        })
      }
      toBubble.splice(0)

      return {preventDefault, bubbleCancelled}
    }
  }
}

//global function ta start a crawler
function crawl(...args) { // global
  const target = typeof args[0] == 'string' ? masterLayer : args.splice(0, 1)
  const eventName = args.splice(0, 1)

  if (!crawlers[eventName]) throw new Error(`Cannot crawl ${eventName}, us createCrawler() to define a crawler`)
  return crawlers[eventName](target, args[0])
}

function mapMouse(allow, drag) {
  return (target, args, parent) => {
    if (target instanceof Layer) {
      const {xAlign, yAlign, overflow} = target.cameraMode

      if (target.buffer) {
        const middleX = target.sprite.x - target.x + target.sprite.w * target.cameraMode.xAlign
        const middleY = target.sprite.y - target.y + target.sprite.h * target.cameraMode.yAlign
        args.x = middleX + (args.x - target.w * target.cameraMode.xAlign) / target.xm
        args.y = middleY + (args.y - target.h * target.cameraMode.yAlign) / target.ym
        // args[0] = (args[0] + (this.sprite.x + this.w * xAlign)) * this.xm + this.sprite.w * xAlign
        // args[1] = (args[1] + (this.sprite.y + this.h * yAlign)) * this.ym + this.sprite.h * yAlign
      } else {
        const middleX = target.sprite.x + target.w * target.cameraMode.xAlign
        const middleY = target.sprite.y + target.h * target.cameraMode.yAlign

        args.x = middleX + (args.x - parent.w * target.cameraMode.xAlign) / target.xm - target.x
        args.y = middleY + (args.y - parent.h * target.cameraMode.yAlign) / target.ym - target.y
        // args[0] = this.parentSprite.w * xAlign + (args[0] - middleX + this.x) * this.xm
        // args[1] = this.parentSprite.h * yAlign + (args[1] - middleY + this.y) * this.ym
      }
      // const {xAlign, yAlign, overflow} = target.cameraMode
      //
      // // args[0] = (args[0] + (this.x + this.w * xAlign)) * this.xm + this.sprite.w * xAlign
      // // args[1] = (args[1] + (this.y + this.h * yAlign)) * this.ym + this.sprite.h * yAlign
      // if (target.buffer) {
      //   args.x = round((args.x - parent.w * xAlign) / target.xm - (target.x + target.sprite.x + target.w * xAlign))
      //   args.y = round((args.y - parent.h * yAlign) / target.ym - (target.y + target.sprite.y + target.h * yAlign))
      // } else {
      //   args.x = round((args.x - parent.w * xAlign) / target.xm - (target.x + target.w * xAlign))
      //   args.y = round((args.y - parent.h * yAlign) / target.ym - (target.y + target.h * yAlign))
      // }
    } else {
      args.x = round(args.x / target.xm - target.x)
      args.y = round(args.y / target.ym - target.y)
    }

    if (drag) {
      args.xd = args.xd / target.xm
      args.yd = args.yd / target.ym
    }

    return allow ? allow(target, args, parent) : true
  }
}

//onMouse and onClick crawlers
mouseDirs.forEach(dir => {
  const clickMapper = mapMouse((t, a, p) => t._hovered ? t._wasOnClick = true : false)
  const mouseMapper = mapMouse((t, a, p) => !t._hovered)
  createCrawler(`on${dir}Click`, clickMapper)
  createCrawler(`on${dir}Mouse`, mouseMapper)
})

addEventListenerAfterPreload('mousedown', event => {
  const {x, y, button} = event

  mouseIsClicked = button + 1

  const mouseDownNames = [
    `on${mouseDirs[button]}Click`, 'onClick',
    `on${mouseDirs[button]}Mouse`, 'onMouse'
  ]

  for (let i = 0; i < mouseDownNames.length; i++) {
    const {bubbleCancelled} = crawl(mouseDownNames[i], {x, y, button})

    if (bubbleCancelled) {
      break
    }
  }

  event.preventDefault()
});

//onMouseDrag and onClickDrag crawlers
createCrawler('onDrag', mapMouse(false, true))
mouseDirs.forEach(dir => {
  const mapper = mapMouse((t, a, p) => t._wasOnClick, true)
  createCrawler(`on${dir}MouseDrag`, mapper)
})

addEventListenerAfterPreload('mousemove', ({movementX, movementY, x, y}) => {
  mouseX = x
  mouseY = y
  const args = {x, y, xd: movementX, yd: movementY, button: mouseIsClicked - 1}
  crawl('onDrag', Object.assign({}, args))
  if (mouseIsClicked) {
    crawl('onMouseDrag', Object.assign({}, args))
    crawl(`on${mouseDirs[mouseIsClicked - 1]}MouseDrag`, Object.assign({}, args))
  }
});

//onMouseUp and onClickUp crawlers
mouseDirs.forEach(dir => {
  const clickUp = mapMouse((t, a, p) => t._hovered && t._wasOnClick)
  const mouseUp = mapMouse((t, a, p) => !t._hovered && !t._wasOnClick)
  const clickReleased = mapMouse((t, a, p) => !t._hovered && t._wasOnClick)
  const mouseReleased = mapMouse((t, a, p) => t._hovered && !t._wasOnClick)

  createCrawler(`on${dir}ClickUp`, clickUp)
  createCrawler(`on${dir}MouseUp`, mouseUp)
  createCrawler(`on${dir}ClickReleased`, clickReleased)
  createCrawler(`on${dir}MouseReleased`, mouseReleased)
})

addEventListenerAfterPreload('mouseup', ({x, y, button}) => {
  mouseIsClicked = 0

  const mouseUpNames = [
    `on${mouseDirs[button]}ClickUp`, 'onClickUp',
    `on${mouseDirs[button]}MouseUp`, 'onMouseUp',
    `on${mouseDirs[button]}ClickReleased`, 'onClickReleased',
    `on${mouseDirs[button]}MouseReleased`, 'onMouseReleased'
  ]

  for (let i = 0; i < mouseUpNames.length; i++) {
    const {bubbleCancelled} = crawl(mouseUpNames[i], {x, y, button})

    if (bubbleCancelled) {
      break
    }
  }

  deClickAll(masterLayer)
});

function deClickAll(target) {
  target._wasOnClick = false
  if (typeof target.forEachChild == 'function') {
    target.forEachChild(deClickAll)
  }
}

//onKey crawler
createCrawler('onKey')
addEventListenerAfterPreload('keydown', event => {
  if (allowRepeatedKeyPressed || !event.repeat) {

    const output = getKey(event)
    const {name, key, keyCode} = output

    if (downKeys[name] || downKeys[keyCode]) {
      if (debugEnabled) console.warn(`Duplicate event!`, event);
      return
    }

    downKeys[name] = true
    downKeys[keyCode] = true

    crawl('onKey', output)

    if (key == '$') {
      debugEnabled = !debugEnabled
      redrawAll = true
      masterLayer.changed = true
    }
  }
});

//onKeyUp crawler
createCrawler('onKeyUp')
addEventListenerAfterPreload('keyup', event => {

  const output = getKey(event)
  const {key, name, keyCode} = output

  if (!downKeys[name] || !downKeys[keyCode]) {
    if (debugEnabled) console.warn(`Duplicate event!`, event);
    return
  }

  downKeys[name] = false
  downKeys[keyCode] = false

  crawl('onKeyUp', output)
});

function getKey(event) {
  const {key, keyCode, code } = event
  lowerKey = key.length == 1 ? key.toLocaleLowerCase() : key
  const name = names[lowerKey] || lowerKey

  return {key: lowerKey, originalKey: key, keyCode, code, event, name}
}

//wheel crawler
createCrawler('onWheel')
addEventListenerAfterPreload('wheel', event => {
  crawl('onWheel', {dir: Math.sign(event.deltaY)})
});

createCrawler('onResize', t => t instanceof Layer)
addEventListenerAfterPreload('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight

  crawl('onResize', {width, height, w: width, h: height})
});


const hoverMapper = mapMouse((t, a, p) => pointIsInRange(a, t.w, t.h) && !t._hovered ? t._hovered = true : false)
const unHoverMapper = mapMouse((t, a, p) => !pointIsInRange(a, t.w, t.h) && t._hovered ? !(t._hovered = false) : false)
createCrawler(`onHover`, hoverMapper)
createCrawler(`onUnhover`, unHoverMapper)

function updateMouseHover() {
  if (mouseX != -1) {
    crawl('onHover', {x: mouseX, y: mouseY})
    crawl('onUnhover', {x: mouseX, y: mouseY})
  }
}
