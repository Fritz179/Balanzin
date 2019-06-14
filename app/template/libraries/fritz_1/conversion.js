p5.prototype.xyi = (x, y) => {
  const {w, h} = status.maps
  if (x >= w || x < 0 || y >= h || y < 0) return -1
  return y * w + x
}

p5.prototype.ixy = i => {
  const {w, h} = status.maps
  if (i > w * h || i < 0) return {x: -1, y: -1}
  return {x: i % w, y: (i - (i % w)) / h}
}

p5.prototype.xytxy = (x, y) => {
  const {w, h, s} = status.maps
  const camera = status.camera
  const {x1, y1} = camera

  x = floor((x - canvas.xOff + x1 * camera.multiplierX) / (s * camera.multiplierX))
  y = floor((y - canvas.yOff + y1 * camera.multiplierY) / (s * camera.multiplierY))

  return (x >= w || x < 0 || y >= h || y < 0) ? {x: -1, y: -1} : {x: x, y: y}
}

p5.prototype.xyti = (x, y) => {
  const {x2, y2} = p5.prototype.xytxy(x, y)
  return p5.prototype.xyi(x2, y2)
}

p5.prototype.txyxy = (x, y) => {
  return {x: p5.prototype.txx(x), y: p5.prototype.tyy(y)}
}

p5.prototype.txx = x => {
  const camera = status.camera
  return (x -camera.x1) * camera.multiplierX + camera.canvas.xOff
}

p5.prototype.tyy = y => {
  const camera = status.camera
  return (y -camera.y1) * camera.multiplierY + camera.canvas.yOff
}

let oldMousePosExist = false
function updateVariables() {
  if (oldMousePosExist) {
    _setProperty('pmouseTileX', mouseTileX)
    _setProperty('pmouseTileY', mouseTileY)
    _setProperty('pmouseTileI', mouseTileI)
  } else oldMousePosExist = true

  const tileCord = p5.prototype.xytxy(mouseX, mouseY)
  _setProperty('mouseTileX', tileCord.x)
  _setProperty('mouseTileY', tileCord.y)
  _setProperty('mouseTileI', p5.prototype.xyi(tileCord.x, tileCord.y))
}
