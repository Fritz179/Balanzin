function pointIsInRect(a, b) {
  return !(
    a.x < b.x ||
    a.y < b.y ||
    a.x > b.x + b.w ||
    a.y > b.y + b.h
  )
}

function rectIsInRect(a, b) {
  return (
    a.y > b.y &&
    a.x > b.x &&
    a.x + a.w < b.x + b.w &&
    a.y + a.h < b.y + b.h
  )
}

function rectIsOnRect(a, b) {
  return !(
    a.x + a.w < b.x ||
    a.y + a.h < b.y ||
    a.x > b.x + b.w ||
    a.y > b.y + b.h
  )
}

function setRectInRect(a, b) {
  if (a.w > b.w || a.h > b.h) console.warn('Cannot put bigger rect in smaller rect');

  if (a.x < b.x) {
    a.x = b.x
    if (a.xv) a.xv = 0
  }
  if (a.y < b.y) {
    a.y = b.y
    if (a.yv) a.yv = 0
  }
  if (a.x + a.w > b.x + b.w) {
    a.x = b.x + b.w - a.w
    if (a.xv) a.xv = 0
  }
  if (a.y + a.h > b.y + b.h) {
    a.y = b.y + b.h - a.h
    if (a.yv) a.yv = 0
  }
}

function rectIsInPoint(a, b) {
  return pointIsInRect(b, a)
}

function pointIsInRange(a, w, h) {
  return !(
    a.x < 0 ||
    a.y < 0 ||
    a.x > w ||
    a.y > h
  )
}
