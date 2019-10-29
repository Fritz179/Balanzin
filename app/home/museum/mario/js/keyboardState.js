const PRESSED = 1
const RELEASED = 0

export default class keyboard {
  constructor() {
    this.keyState = new Map()
    this.keyMap = new Map()
  }

  addMapping(code, callback) {
    this.keyMap.set(code, callback)
  }

  handleEvent(event) {
    const {code} = event
    if (!this.keyMap.has(code)) {
      return
    }
      event.preventDefault()
      const keyState = event.type == 'keydown' ? PRESSED : RELEASED
      if (this.keyState.get(code) == keyState) {
        return
      }
      this.keyState.set(code, keyState)
      this.keyMap.get(code)(keyState)
  }

  listenTo() {
    ['keydown', 'keyup'].forEach(eventName => {
      window.addEventListener(eventName, event => {
        this.handleEvent(event)
      })
    })

  }
}
