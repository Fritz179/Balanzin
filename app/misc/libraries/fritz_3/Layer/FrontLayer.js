class FrontLayer extends Layer {
  constructor() {
    super()

    this.texts = []
    this.textCount = 0
  }

  updateCapture() {
    this.textCount = 0
  }

  renderBubble() {
    this.texts.forEach(({text, x, y}) => {
      this.text(text, x, y)
    })
  }

  setText(text, x, y) {
    if (!this.texts[this.textCount] || this.texts[this.textCount].text != text) {
      this.changed = true
      this.texts[this.textCount] = {text, x, y}
    }

    this.textCount++
  }

  render() {
    return false
  }
}
