export default class timer {
  constructor(deltaTime) {
    let accumulatedTime = 0
    var lastTime = 0

    this.updateProxy = (time) => {
      accumulatedTime += (time - lastTime) / 1000

      if (accumulatedTime > 1) {
        accumulatedTime = 1
      }

      while(accumulatedTime > deltaTime) {
        this.update(deltaTime)
        accumulatedTime -= deltaTime
      }
      lastTime = time
      requestAnimationFrame(this.updateProxy)
    }
  }

  start() {
    requestAnimationFrame(this.updateProxy)
  }
}
