loadSprite('player', './img/sprites')
loadSprite('pointer', './img/sprites')
loadSprite('tiles', './img/sprites')
loadSprite('items', './img/sprites')
loadSprite('slot', './img/sprites')
loadSprite('tools', './img/sprites')
const recipes = loadJSON('./inventory/recipes.json', true)
// loadSprite('slot', {path: './img/sprites', recursive: 2})

let main

noiseSeed(420)
function setup() {
  addLayer(main = new Main())
  addLayer(main.player.inventory = new Inventory())
  addLayer(main.hand)
  addLayer(new Overlay())

  // main.player.inventory.add('wood', 9)
}

addCollision(Player, Drop)
addCollision(Furnace, Player)
addCollision(CraftingTable, Player)
addCollision(Drop, Drop)
addEntities(Player, Drop, Furnace, CraftingTable)

function tp(x, y = false) {
  if (y === false) y = (ceil(noise(x / 320) * 50)) * 16 - 24
  main.player.pos.set(x, y)
}

class Main extends TileGame {
  constructor() {
    super('auto')

    this.setScale(this.zoom = 3)
    this.setCameraMode({align: 'center', overflow: 'display'})
    this.setSize(window.innerWidth, window.innerHeight, true)

    // this.w = window.innerWidth
    // this.h = window.innerHeight

    // create palyer
    this.player = new Player(1600, (ceil(noise(1600 / 320) * 50)) * 16 - 24)
    // this.center = this.player.center
    this.addChild(this.player)

    // create player attachments
    this.pointer = this.addChild(new Pointer(this))
    this.hand = new Hand(this.pointer)

    this.chunkLoader = new MainChunkLoader()
    this.setChunkLoader(2, 5)
  }

  onDrag({x, y}) {
    this.pointer.offset.set(x - this.sprite.x, y - this.sprite.y)
  }

  onKey({name}) {
    switch (name) {
      case ',': this.changeZoom(-1); break;
      case '.': this.changeZoom(1); break;
    }
  }

  changeZoom(dir) {
    this.zoom -= dir

    if (this.zoom <= 0 && !debugEnabled) this.zoom = 1
    else if (this.zoom > 10) this.zoom = 10
    else this.zoom |= 0

    if (this.zoom <= 0) {
      this.zoom = 0
      this.setScale(1)
      this.setChunkLoader(1, 1)

    } else {
      const d = 6 / this.zoom

      this.setScale(this.zoom)
      this.setChunkLoader(d > 1 ? d : 1, 7)
    }
  }

  update() {
    let {x, y} = this.player.center
    this.sprite.center = {x: x, y: y}
  }

  onBlockPlaced({id, x, y, chunk, xc, yc}) {
    const {name} = tiles[id]

    switch (name) {
      case 'furnace': this.addChild(new Furnace({x, y, xc, yc}, chunk)); break;
      case 'crafting_table': this.addChild(new CraftingTable({x, y, xc, yc}, chunk)); break;
    }
  }
}

addCordMiddleware(Main, 'placeBlockAt', 2)

// const globalKeys = ["parent", "opener", "top", "length", "frames", "closed", "location", "self", "window", "document", "name", "customElements", "history", "locationbar", "menubar", "personalbar", "scrollbars", "statusbar", "toolbar", "status", "frameElement", "navigator", "origin", "external", "screen", "innerWidth", "innerHeight", "scrollX", "pageXOffset", "scrollY", "pageYOffset", "visualViewport", "screenX", "screenY", "outerWidth", "outerHeight", "devicePixelRatio", "clientInformation", "screenLeft", "screenTop", "defaultStatus", "defaultstatus", "styleMedia", "onsearch", "onwebkitanimationend", "onwebkitanimationiteration", "onwebkitanimationstart", "onwebkittransitionend", "isSecureContext", "onabort", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncontextmenu", "oncuechange", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onseeked", "onseeking", "onselect", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange", "onwaiting", "onwheel", "onauxclick", "ongotpointercapture", "onlostpointercapture", "onpointerdown", "onpointermove", "onpointerup", "onpointercancel", "onpointerover", "onpointerout", "onpointerenter", "onpointerleave", "onselectstart", "onselectionchange", "onanimationend", "onanimationiteration", "onanimationstart", "ontransitionend", "onafterprint", "onbeforeprint", "onbeforeunload", "onhashchange", "onlanguagechange", "onmessage", "onmessageerror", "onoffline", "ononline", "onpagehide", "onpageshow", "onpopstate", "onrejectionhandled", "onstorage", "onunhandledrejection", "onunload", "performance", "stop", "open", "alert", "confirm", "prompt", "print", "queueMicrotask", "requestAnimationFrame", "cancelAnimationFrame", "captureEvents", "releaseEvents", "requestIdleCallback", "cancelIdleCallback", "getComputedStyle", "matchMedia", "moveTo", "moveBy", "resizeTo", "resizeBy", "scroll", "scrollTo", "scrollBy", "getSelection", "find", "webkitRequestAnimationFrame", "webkitCancelAnimationFrame", "fetch", "btoa", "atob", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "createImageBitmap", "close", "focus", "blur", "postMessage", "onappinstalled", "onbeforeinstallprompt", "crypto", "indexedDB", "webkitStorageInfo", "sessionStorage", "localStorage", "chrome", "onformdata", "onpointerrawupdate", "speechSynthesis", "webkitRequestFileSystem", "webkitResolveLocalFileSystemURL", "openDatabase", "applicationCache", "caches", "ondevicemotion", "ondeviceorientation", "ondeviceorientationabsolute"]
//
// function checkKeys() {
//   const ret = []
//
//   Object.keys(window).forEach(key => {
//     if (!globalKeys.includes(key)) {
//       ret.push(key)
//     }
//   })
//
//   console.log(ret);
// }
//
// Object.defineProperty(window, 'i', {
//   set: () => { debugger }
// })
