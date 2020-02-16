class Overlay extends FrontLayer {
  constructor() {
    super()
    this.updateTimes = 0

    this.setCameraMode({align: 'right-top', overflow: 'display'})
  }

  update() {
    this.updateTimes++

    const {ups, fps, runTime} = timer
    const {x, y} = main.player
    const f = Math.floor

    this.setText(`FPS: ${timer.fps}, UPS: ${timer.ups}`, -10, 10)
    this.setText(`X: ${f(x)}, ${f(x / 16)}, ${f(x / 256)}`, -10, 40)
    this.setText(`Y: ${f(y)}, ${f(y / 16)}, ${f(y / 256)}`, -10, 70)
    this.setText(`LAST: ${f(runTime * 100) / 100}ms = ${f(runTime * fps) / 10}%`, -10, 100)
  }

  getSprite() {
    this.fill(255)
    this.textSize(30)
    this.textFont('consolas')
    this.textAlign('right', 'top')

    const tf = timer.totalFixedUpdates, tu = timer.totalUpdates, td = timer.totalGetSprite
    this.text(`F: ${tf}, U: ${tu}, D: ${td}`, -10, 130)

    return false
  }
}
