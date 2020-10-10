let scale = 20

window.addEventListener('keydown', ({key}) => {
  if (key == ',') scale++
  if (key == '.') scale--
})

const ICanvas = ({i}) => {
  const size = 500

  const maxVal = i.sort((a, b) => a[0] - b[0])[2][0]
  scale = Math.ceil(size / maxVal * 0.3)

  const canvasRef = useCanvas(ctx => {
    const r = size / 2
    ctx.clearRect(0, 0, size, size)
    ctx.translate(r, r)

    ctx.fillStyle  = '#444'
    ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2)
    ctx.fill();

    ctx.lineWidth = 2

    const sum = {x: 0, y: 0}

    // loop for every current
    i.forEach(([curr, a]) => {
      const x = Math.sin(a) * curr
      const y = Math.cos(a) * curr

      // draw dotted line
      ctx.strokeStyle  = '#000'
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r)
      ctx.stroke()

      // draw base current + sum
      ctx.strokeStyle  = '#0F0'
      ctx.beginPath()
      ctx.setLineDash([]);
      ctx.moveTo(0, 0)
      ctx.lineTo(x * scale, y * scale)
      ctx.moveTo(sum.x * scale, sum.y * scale)
      sum.x += x
      sum.y += y
      ctx.lineTo(sum.x * scale, sum.y * scale)
      ctx.stroke()
    })

    // draw n current
    ctx.strokeStyle  = '#F00'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(sum.x * scale, sum.y * scale)
    ctx.stroke()

    // reset
    ctx.closePath()
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.font = '50px consolas'
    ctx.fillStyle = '#000'
    ctx.textAlign = "center";

    const l = Math.round(Math.sqrt(sum.x * sum.x + sum.y * sum.y) * 1000) / 1000
    ctx.fillText(`I=${l}`, r, size * 0.9)

    ctx.font = '30px consolas'
    ctx.fillText(`1A = ${scale}px`, r, size * 0.95)

  }, size, size)

  return <canvas ref={canvasRef}/>
}
