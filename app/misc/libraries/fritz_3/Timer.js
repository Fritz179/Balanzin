class Timer {
  constructor(fps, fixedUpdate, update = () => { }, start = true, throttle = 8) {
    this.timeStep = 1000 / fps
    this.fixedUpdate = fixedUpdate
    this.update = update

    this.time = 0
    this.lastTime = 0
    this.accTime = 0
    this.request = null
    this.updated = false
    this.throttle = throttle
    this._fps = this.fps = 0
    this._ups = this.ups = 0
    this._runTime = this.runTime = 0
    this.totalUpdates = this.totalFixedUpdates = this.totalRender = 0

    if (start) {
      this.start()
    }
  }

  run(timeStamp) {
    const dt = timeStamp - this.time
    this.time = timeStamp

    this.lastTime += dt
    this.accTime += dt

    // if the engine is too far back, update at max (8) times
    if (this.accTime > this.timeStep * this.throttle) {
      console.warn(`Heavy lag detected! lost ${this.accTime - this.timeStep * this.throttle}ms!`);
      this.accTime = this.timeStep * this.throttle
    }

    while (this.accTime >= this.timeStep) {
      this.accTime -= this.timeStep
      this.updated = true

      this.fixedUpdate(timeStamp)
      this._ups++

      this.totalFixedUpdates++
    }

    if (this.updated) {
      this.updated = false

      if (this.update(timeStamp)) {
        this.totalRender++
      }

      this._fps++

      this._runTime += window.performance.now() - timeStamp
      this.totalUpdates++
    }

    if (this.lastTime >= 1000) {
      if (this.lastTime >= 2000) this.lastTime = 1000

      this.lastTime -= 1000
      this.fps = this._fps
      this.ups = this._ups
      this.runTime = this._runTime / this.fps
      this._fps = this._ups = this._runTime = 0
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
