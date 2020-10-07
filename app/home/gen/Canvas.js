let scale = 10

window.addEventListener('keydown', ({key}) => {
  if (key == ',') scale++
  if (key == '.') scale--
})

const Canvas = ({i}) => {
  const width = 500, height = 500

  const canvasRef = useCanvas(ctx => {
    const r = width / 2
    ctx.clearRect(0, 0, width, height)
    ctx.translate(r, r)

    ctx.fillStyle  = '#444'
    ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2)
    ctx.fill();
    // ctx.fillRect(-r, -r, r * 2, r * 2)

    ctx.lineWidth = 2
    ctx.strokeStyle  = '#000'

    //
    ctx.beginPath()
    ctx.setLineDash([5, 5])
    i.forEach(([curr, angle]) => {
      const a = angle / 360 * Math.PI * 2 + Math.PI
      const x = Math.sin(a) * r
      const y = Math.cos(a) * r

      ctx.moveTo(0, 0)
      ctx.lineTo(x, y)
    })
    ctx.stroke()

    let sum = {x: 0, y: 0}
    ctx.strokeStyle  = '#0F0'

    ctx.beginPath()
    ctx.setLineDash([]);
    i.forEach(([curr, angle]) => {
      const a = angle / 360 * Math.PI * 2 + Math.PI
      const x = Math.sin(a) * curr
      const y = Math.cos(a) * curr

      ctx.moveTo(0, 0)
      ctx.lineTo(x * scale, y * scale)

      ctx.moveTo(sum.x * scale, sum.y * scale)
      sum.x += x
      sum.y += y
      ctx.lineTo(sum.x * scale, sum.y * scale)
    })

    ctx.stroke()

    ctx.strokeStyle  = '#F00'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(sum.x * scale, sum.y * scale)
    ctx.stroke()

    ctx.closePath()
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.font = '50px consolas'
    ctx.fillStyle = '#000'

    const l = Math.round(Math.sqrt(sum.x * sum.x + sum.y * sum.y) * 1000) / 1000
    ctx.fillText(`I=${l}`, width * 0.35, height * 0.9)

    ctx.font = '30px consolas'
    ctx.fillText(`1A = ${scale}px`, width * 0.36, height * 0.95)

  }, width, height)

  return <canvas ref={canvasRef}/>
}
