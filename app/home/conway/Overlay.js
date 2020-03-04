class Overlay extends FrontLayer {
  constructor() {
    super()
    this.updateTimes = 0

    this.setCameraMode({align: 'right-top', overflow: 'display'})
  }

  update() {
    this.updateTimes++

    const {ups, fps, runTime} = timer
    const f = Math.floor

    this.setText(`FPS: ${timer.fps}, UPS: ${timer.ups}`, -10, 10)
    this.setText(`LAST: ${f(runTime * 100) / 100}ms = ${f(runTime * fps) / 10}%`, -10, 40)
  }

  getSprite() {
    this.fill(0)
    this.textSize(30)
    this.textFont('consolas')
    this.textAlign('right', 'top')

    const tf = timer.totalFixedUpdates, tu = timer.totalUpdates, td = timer.totalGetSprite
    this.text(`F: ${tf}, U: ${tu}, D: ${td}`, -10, 70)

    return false
  }
}
