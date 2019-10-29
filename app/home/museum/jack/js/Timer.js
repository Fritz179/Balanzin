export default class Timer {
  constructor(level, deltaTime = 1/60) {
    this.level = level
    this.toStop = false
    let accumulatedTime = 0;
    let lastTime = 0;

    this.updateProxy = (time) => {
      accumulatedTime += (time - lastTime) / 1000;

      if (accumulatedTime > 1) {
        console.warn("accumulatedTime: " + accumulatedTime);
        accumulatedTime = 1;
      }

      while (accumulatedTime > deltaTime) {
        this.level.update();
        accumulatedTime -= deltaTime;
      }

      lastTime = time;

      if (!this.toStop) {
        this.enqueue();
      }
    }
  }

  enqueue() {
    requestAnimationFrame(this.updateProxy);
  }

  start() {
    this.toStop = false
    this.enqueue();
  }

  stop() {
    this.toStop = true
  }
}
