import assert from './assert.js'

class Timer {
  update?: () => void
  load?: () => Promise<any>
  draw?: () => void
  run: boolean
  lastTime: number
  accTime: number
  framerate: number
  request: number

  constructor() {
    this.run = false
    this.accTime = 0
    this.lastTime = 0
    this.framerate = 1000 / 60
    this.request = 0

    window.addEventListener('load', async () => {
      if (this.load) await this.load()
      this.start()
    })
  }

  step(time: number) {
    assert(this.update && this.draw, 'Not defined update or draw function')

    const diff = time - this.lastTime
    this.lastTime = time
    this.accTime += diff

    while (this.accTime > this.framerate) {
      this.update()
      this.accTime -= this.framerate
    }

    this.draw()

    this.request = window.requestAnimationFrame(time => this.step(time))
  }

  start() {
    this.run = true
    this.lastTime = window.performance.now()
    this.accTime = 0

    this.request = window.requestAnimationFrame(time => this.step(time))
  }

  stop() {
    this.run = false
    window.cancelAnimationFrame(this.request)
  }

  toggle() {
    if (this.run) {
      this.stop()
    } else {
      this.start()
    }
  }
}

const timer = new Timer()
export default timer