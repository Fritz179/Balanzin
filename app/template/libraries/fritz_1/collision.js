p5.prototype.collideRectMap = (rect, maps, sides = 3) => {
  const {collisions, w, h, tileWidth} = maps

  //// TODO: check if rect is on map...
  // if (p5.prototype.rectInsideRect(rect, {x1: 0, y1: 0, x2: w * tileWidth, y2: h * tileWidth})) { //on Map
  if (1) { //on Map
    if (sides & 1) {
      //chex x-axis

      let x = 0
      let y = floor(rect.y1 / tileWidth)
      let y2 = ceil(rect.y2 / tileWidth)

      if (rect.xv > 0) { //right
        x = floor(rect.x2 / tileWidth)
        do {
          if (collisions[maps.tileAt(x, y)] & 8) rect._onMapCollision('right', x, y, tileWidth)
          y += 1
        } while (y < y2)

      } else if (rect.xv < 0) { //left
        x = floor(rect.x1 / tileWidth)
        do {
          if (collisions[maps.tileAt(x, y)] & 2) rect._onMapCollision('left', x, y, tileWidth)
          y += 1
        } while (y < y2)
      }
    }

    if (sides & 2) {
      //chex y-axis

      let y = 0
      let x = floor(rect.x1 / tileWidth)
      let x2 = ceil(rect.x2 / tileWidth)

      if (rect.yv > 0) { //bottom
        y = floor(rect.y2 / tileWidth)
        do {
          if (collisions[maps.tileAt(x, y)] & 1) rect._onMapCollision('bottom', x, y, tileWidth)
          x += 1
        } while (x < x2)

      } else if (rect.yv < 0) { //top
        y = floor(rect.y1 / tileWidth)
        do {
          if (collisions[maps.tileAt(x, y)] & 4) rect._onMapCollision('top', x, y, tileWidth)
          x += 1
        } while (x < x2)
      }
    }
  }
}

p5.prototype.getIntersectingTiles = (rect, maps) => {
  const {collisions, w, h, tileWidth} = maps
  const intersecting = new Set()

  const x1 = floor(rect.x1 / tileWidth)
  const x2 = ceil(rect.x2 / tileWidth)
  const y1 = floor(rect.y1 / tileWidth)
  const y2 = ceil(rect.y2 / tileWidth)
  let x = x1, y

  do {
    y = y1
    do {
      intersecting.add(maps.tileAt(x, y))
      y++
    } while (y < y2)
    x++
  } while (x < x2)

  return intersecting
}

p5.prototype.collideRectRect = (a, b) => {
  return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1
}

p5.prototype.solveRectRect = (a, b) => {
  throw new Error('// TODO: crea al solveRectRect')
}

p5.prototype.solveRectIRect = (a, b) => {
  if (abs(a.xv) > abs(a.yv)) {
    if (a.xv > 0) a.x2 = b.x1
    else a.x1 = b.x2
    a.xv = 0
  } else {
    if (a.yv > 0) a.y2 = b.y1
    else a.y1 = a.y2
    a.yv = 0
  }
}

p5.prototype.rectInsideRect = (a, b) => {
  return a.x1 > b.x1 && a.x2 < b.x2 && a.y1 > b.y1 && a.y2 < b.y2
}

p5.prototype.collideCircleCircle = (a, b) => {
  const r = a.r + b.r
  const x = a.x + b.x
  const y = a.y + b.y
  return r * r < x * x + y * y
}

p5.prototype.collidePointRect = (a, b) => {
  return a.x < b.x2 && a.x > b.x1 && a.y < b.y2 && a.y > b.y1
}

p5.prototype.realMouseIsOver = a => {
  return a.mouseX > 0 && a.mouseY > 0 && a.mouseX < a.w && a.mouseY < a.h
}
