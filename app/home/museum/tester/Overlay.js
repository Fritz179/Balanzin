class Overlay extends Layer {
  constructor() {
    super({align: 'top-right', size: 'none'}, true)

    this.overlay = []
    this.overlayMode = [0, 0]
  }

  addText(x, y, updateFun) {
    this.overlay.push(new P(this, x, y, updateFun, this.overlayMode))
  }

  addTextList(x, y, w, h, updateFuns) {
    updateFuns.forEach(fun => {
      this.addText(x, y, fun)
      x += w
      y += h
    })
  }

  updateBubble() {
    this.overlay.forEach(item => item.update())
  }

  overlayAlign(align) {
    this.overlayMode = getAlign(align)
  }
}

class P {
  constructor(parent, x, y, updateFun, [xAlign = 0, yAlign = 0]) {
    this.p = document.createElement('p')
    parent.container.appendChild(this.p)

    this.p.style.transform = `translate(calc(-${xAlign * 100}% + ${x}px),
                                        calc(-${yAlign * 100}% + ${y}px))`

    this.pos = [x, y]
    this.updateFun = updateFun
    this.cache = ''
  }

  update() {
    const text = this.updateFun().replace(/\n/g, '<br>')

    if (text != this.cache) {
      this.cache = text
      this.p.innerHTML = text
    }
  }
}

function padNumRight(n, to) {
  return n.toString().slice(0, to).padEnd(to, '\xa0')
}

class Test extends Overlay {
  constructor() {
    super({align: 'top-right', size: 'none'}, true)

    this.overlayAlign('top-right')
    this.addText(0, 0, () => {
      const {fps, ups, runTime} = timer
      const {x, y, xv, yv} = masterLayer.main.player
      const tf = timer.totalFixedUpdates, tu = timer.totalUpdates, tr = timer.totalRender

      return `FPS: ${fps}, UPS: ${ups}
        X: ${floor(x)}, Y: ${floor(y)}
        LAST: ${floor(runTime * 100) / 100}ms = ${floor(runTime * fps) / 10}%
        F: ${tf}, U: ${tu}, R: ${tr}
        XV: ${padNumRight(xv, 5)}, YV: ${padNumRight(yv, 5)}`
    })
  }
}
