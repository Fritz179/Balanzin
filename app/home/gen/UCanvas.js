let scale = 10

window.addEventListener('keydown', ({key}) => {
  if (key == ',') scale++
  if (key == '.') scale--
})

const UCanvas = ({i}) => {
  const size = 500

  const canvasRef = useCanvas(ctx => {
    const r = size / 2
    ctx.clearRect(0, 0, size, size)
    ctx.translate(r, r)

    ctx.fillStyle  = '#444'
    ctx.beginPath()
    ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2)
    ctx.fill();
    ctx.closePath()
    // ctx.fillRect(-r * 0.7, 0, r * 1.4, r)

    // draw dotted line
    const points = i.map(([l, a]) => [Math.sin(a), Math.cos(a)])

    const inter = (a, b, t) => a + (b - a) * t

    // get only two lines
    const res = i.map(e => e[0])
    const t1 = i[0][0] / (i[0][0] + i[1][0])
    const t2 = i[1][0] / (i[1][0] + i[2][0])

    // get line points
    const x1 = points[2][0], y1 = points[2][1]
    const x3 = points[0][0], y3 = points[0][1]
    const x2 = inter(points[0][0], points[1][0], t1)
    const y2 = inter(points[0][1], points[1][1], t1)
    const x4 = inter(points[1][0], points[2][0], t2)
    const y4 = inter(points[1][1], points[2][1], t2)

    // http://paulbourke.net/geometry/pointlineplane/
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    const x = x1 + ua * (x2 - x1)
    const y = y1 + ua * (y2 - y1)

    // get new voltage levels
    const u1 = Math.sqrt((x - points[0][0]) ** 2 + (y - points[0][1]) ** 2) * 230
    const u2 = Math.sqrt((x - points[1][0]) ** 2 + (y - points[1][1]) ** 2) * 230
    const u3 = Math.sqrt((x - points[2][0]) ** 2 + (y - points[2][1]) ** 2) * 230

    const u12 = Math.sqrt((points[0][0] - points[1][0]) ** 2 + (points[0][1] - points[1][1]) ** 2) * 230
    const u13 = Math.sqrt((points[0][0] - points[2][0]) ** 2 + (points[0][1] - points[2][1]) ** 2) * 230
    const u23 = Math.sqrt((points[1][0] - points[2][0]) ** 2 + (points[1][1] - points[2][1]) ** 2) * 230

    ctx.lineWidth = 2
    ctx.strokeStyle  = '#000'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(points[0][0] * r, points[0][1] * r)
    ctx.lineTo(0, 0)
    ctx.lineTo(points[1][0] * r, points[1][1] * r)
    ctx.moveTo(points[2][0] * r, points[2][1] * r)
    ctx.lineTo(0, 0)
    ctx.stroke()

    ctx.strokeStyle  = '#0FF'
    ctx.beginPath()
    ctx.setLineDash([0, 0])
    ctx.moveTo(x * r, y * r)
    ctx.lineTo(points[0][0] * r, points[0][1] * r)
    ctx.lineTo(points[1][0] * r, points[1][1] * r)
    ctx.lineTo(points[2][0] * r, points[2][1] * r)
    ctx.lineTo(x * r, y * r)
    ctx.lineTo(points[1][0] * r, points[1][1] * r)
    ctx.moveTo(points[0][0] * r, points[0][1] * r)
    ctx.lineTo(points[2][0] * r, points[2][1] * r)
    ctx.moveTo(x * r, y * r)
    ctx.stroke()

    // reset
    ctx.closePath()
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const round = i => Math.round(i * 100) / 100

    ctx.font = '30px consolas'
    ctx.fillStyle = '#000'
    ctx.textAlign = "center";
    ctx.fillText(`U1=${round(u1)} U12=${round(u12)}`, r, size * 0.80)
    ctx.fillText(`U2=${round(u2)} U23=${round(u23)}`, r, size * 0.85)
    ctx.fillText(`U3=${round(u3)} U13=${round(u13)}`, r, size * 0.90)

  }, size, size)

  return <canvas ref={canvasRef}/>
}
