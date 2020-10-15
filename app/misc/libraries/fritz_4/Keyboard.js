export default new class Keyboard {
  constructor() {
    this.pressedKey = new Set()

    this.onPressed = new Set()
    this.onReleased = new Set()

    window.addEventListener('keydown', e => {
      if (e.repeat) return

      if (this.pressedKey.has(e.key)) return
      this.pressedKey.add(e.key)

      this.onPressed.forEach(fun => fun(e.key))
    })

    window.addEventListener('keyup', e => {
      if (e.repeat) return

      if (!this.pressedKey.has(e.key)) return
      this.pressedKey.delete(e.key)

      this.onReleased.forEach(fun => fun(e.key))
    })
  }

  onKeyDown(fun) {
    this.onPressed.add(fun)
  }

  onKeyUp(fun) {
    this.onReleased.add(fun)
  }
}

// https://www.ti.com/lit/an/slva464e/slva464e.pdf?ts=1602703128556&ref_url=https%253A%252F%252Fwww.google.com%252F
