type callback = (x: number) => void

export default class Timer {
  timeStep: number
  fixedUpdate: callback
  update?: callback

  time: number = 0
  accTime: number = 0

  updated: boolean = false
  throttle: number = 10

  request: number = 0

  constructor(fps: number, fixedUpdate: callback, update?: callback) {
    this.timeStep = 1000 / fps
    this.fixedUpdate = fixedUpdate
    this.update = update
  }

  start() {
    this.accTime = 0
    this.time = window.performance.now()
    this.request = window.requestAnimationFrame(timeStamp => this.run(timeStamp))
  }

  stop() {
    window.cancelAnimationFrame(this.request)
  }

  run(timeStamp: number) {
    // calculate total delta-time
    const dt = timeStamp - this.time
    this.time = timeStamp

    // all the time that has passed, plus the remaining from prevous call
    this.accTime += dt

    // if the engine is too far back, update at max [throttle] times
    if (this.accTime > this.timeStep * this.throttle) {
      console.warn(`Heavy lag detected! lost ${this.accTime - this.timeStep * this.throttle}ms!`);
      this.accTime = this.timeStep * this.throttle
    }

    // do the fixed updates
    while (this.accTime >= this.timeStep) {
      this.accTime -= this.timeStep
      this.updated = true

      this.fixedUpdate(this.timeStep)
    }

    // update only if at least one fixedupdate accured
    if (this.updated && this.update) {
      this.updated = false

      this.update(dt)
    }

    this.request = window.requestAnimationFrame(timeStamp => this.run(timeStamp))
  }
}
