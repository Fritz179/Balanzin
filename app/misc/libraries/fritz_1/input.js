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

p5.prototype.isDown = key => p5.prototype.keyIsDown(names[key])

const validListeners = ['onMouse', 'onMouseDragged', 'onMouseReleased', 'onClick', 'onClickDragged', 'onClickReleased', 'onKey', 'onKeyReleased', 'onWheel']

class Listener {
  constructor() {
    //keep trak of all entities to listen for
    this.onMouse = new Set()
    this.onMouseReleased = new Set()
    this.onMouseDragged = new Set()
    this.onKey = new Set()
    this.onKeyReleased = new Set()
    this.onClick = new Set()
    this.onClickDragged = new Set()
    this.onClickReleased = new Set()
    this.onWheel = new Set()
    this.subListeners = new Set()
  }

  addListener(listener, ...toArr) {
    toArr.forEach(to => {
      //if its a keyWord, expand it
      if (to == 'all') return this.addListener(listener, 'mouse', 'key', 'click')
      if (to == 'mouse') return this.addListener(listener, 'onMouse', 'onMouseDragged', 'onMouseReleased')
      if (to == 'key') return this.addListener(listener, 'onKey', 'onKeyReleased')
      if (to == 'click') return this.addListener(listener, 'onClick', 'onClickDragged', 'onClickReleased')

      //check for subListener
      if (to == 'subListeners' && listener.listener instanceof Listener) return this.subListeners.add(listener)
      if (to == 'subListeners') debugger
      //check if event exists and has an EventHandler function
      if (!validListeners.includes(to)) throw new Error(`Cannot listen to: ${to}, valid events: ${validListeners}`)

      //check if listener has valid function
      if (typeof listener[to] != 'function' && typeof listener[`_${to}`] != 'function') {
        throw new Error(`Listener doesn't have a ${to}() function`)
      }

      //add listener
      this[to].add(listener)
    })
  }

  removeListenerOf(listener, ...toUnlisten) {
    toUnlisten.forEach(of => {
      //check if event exists
      if (!validListeners.includes(of) || of != 'subListeners') throw new Error(`Cannot remove listener of: ${of}, valid events: ${validListeners}`)

      //remove entity
      this[of].delete(listener)
    })
  }

  removeListener(listener) {
    //loop trough all listeners clear it
    validListeners.forEach(of => {
      this[of].delete(listener)
    })

    //Also check if its a sublistener
    this.subListeners.delete(listener)
  }

  removeAllListeners() {
    //loop trough all listeners clear it
    validListeners.forEach(of => {
      this[of].clear()
    })

    //also remove all subListeners
    this.subListeners.remove(listener)
  }
}


                            ///////////////////////
                           //// HANDLE EVENTS ////
                          ///////////////////////


function handleEvent(eventName, listener, allowed = alwaysAllowed, args = []) {
  //if the listener has 'sublisteners', recursively handle them
  //else call it's eventName
  listener[eventName].forEach(entity => {
    if (allowed(entity)) entity[eventName](...args)
  })

  listener.subListeners.forEach(sub => {
    if (allowed(sub)) handleEvent(eventName, sub.listener, allowed, args)
  })
}

const alwaysAllowed = () => true


window.mousePressed = () => {
  //begin the loop to check all subListeners of onMouse
  handleEvent('onMouse', masterStatus.listener)
  handleEvent('onClick', masterStatus.listener, allowClick)

  //helper function, keep loop only if realMouseIsOver the listener
  function allowClick(entity) {
    if (p5.prototype.realMouseIsOver(entity)) {
      //add flag for onClickDragged and onClickReleased
      entity._wasOnClick = true
      //indicate that entity is allowed to be called
      return true
    }
  }
}

window.mouseDragged = () => {

  //begin the loop to check all subListeners of onMouseDragged
  handleEvent('onMouseDragged', masterStatus.listener)
  handleEvent('onClickDragged', masterStatus.listener, allowClickDragged)

  //helper function, keep loop only if listener._wasOnClick
  function allowClickDragged(entity) { return entity._wasOnClick }
}

window.mouseReleased = () => {
  //begin the loop to check all subListeners of onMouseReleased
  handleEvent('onMouseReleased', masterStatus.listener)
  handleEvent('onClickReleased', masterStatus.listener, allowClickReleased)

  //helper function, keep loop only if listener._wasOnClick
  function allowClickReleased(entity) {
    if (entity._wasOnClick) {
      //remove the _wasOnClick flag
      entity._wasOnClick = false
      return true
    }
  }
}

window.keyPressed = () => {
  if (key == '$') debugEnabled = !debugEnabled

  //handle all the listeners
  handleEvent('onKey', masterStatus.listener, alwaysAllowed, [names[key] || key])
}

window.keyReleased = () => {
  //handle all the listeners
  handleEvent('onKeyReleased', masterStatus.listener, alwaysAllowed, [names[key] || key])
}

window.mouseWheel = event => {
  //handle weel event
  handleEvent('onWheel', masterStatus.listener, alwaysAllowed, [Math.sign(event.delta)])

  //prevent default
  return false
}
