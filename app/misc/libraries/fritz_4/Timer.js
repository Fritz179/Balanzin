export default class Timer {
  constructor(fps, fixedUpdate, start = true, throttle = 8) {
    this.timeStep = 1000 / fps
    this.fixedUpdate = fixedUpdate
    this.update = () => { }

    this.time = 0
    this.accTime = 0
    this.request = null
    this.updated = false
    this.throttle = throttle

    if (start) {
      this.start()
    }
  }

  run(timeStamp) {
    const dt = timeStamp - this.time
    this.time = timeStamp

    this.accTime += dt

    // if the engine is too far back, update at max (throttle) times
    if (this.accTime > this.timeStep * this.throttle) {
      console.warn(`Heavy lag detected! lost ${this.accTime - this.timeStep * this.throttle}ms!`);
      this.accTime = this.timeStep * this.throttle
    }

    while (this.accTime >= this.timeStep) {
      this.accTime -= this.timeStep
      this.updated = true

      this.fixedUpdate(timeStamp)
    }

    if (this.updated) {
      this.updated = false

      this.update(timeStamp)
    }

    this.request = window.requestAnimationFrame(timeStamp => this.run(timeStamp))
  }

  start() {
    this.running = true
    this.accTime = 0
    this.time = this.lastTime = window.performance.now()
    this.request = window.requestAnimationFrame(timeStamp => this.run(timeStamp))
  }

  stop() {
    this.running = false
    window.cancelAnimationFrame(this.request)
  }
}
