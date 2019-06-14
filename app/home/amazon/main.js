function preload() {

}

function setup() {
  createStatus(Options)
  createStatus(Play)

  setCurrentStatus('options')
}

// function pixel_to_pointy_hex(point):
//     var q = (sqrt(3)/3 * point.x  -  1./3 * point.y) / size
//     var r = (                        2./3 * point.y) / size
//     return hex_round(Hex(q, r))

function ponitToHex(x, y, size) {
  const q = (sqrt(3) / 3 * x - 1 / 3 * y) / size
  const r = 2 / 3 * y / size
  return {q, r}
}
