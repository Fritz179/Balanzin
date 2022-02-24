interface state {
  realHeight: number,
  wantedHeight: number,
  change: number,
  measured: number,
  error: number
}

const colors = {
  realHeight: '#F00',
  measured: '#00F',
  change: '#0F0',
  wantedHeight: '#000'
} as const

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas')! as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  canvas.width = 800
  canvas.height = 600

  function getInput(name: string, callback: (v: number) => void): number {
    const label = document.querySelector(`label[for="${name}"]`) as HTMLLabelElement
    const originalText = label.innerHTML

    const input = document.getElementById(name)! as HTMLInputElement
    input.oninput = () => {
      label.innerHTML = originalText + `: ${input.value}`
      callback(Number(input.value))
      draw()
    }
    label.innerHTML = `${originalText}: ${input.value}`
    return Number(input.value)
  }

  let P = getInput('pValue', val => P = val)
  let I = getInput('iValue', val => I = val)
  let D = getInput('dValue', val => D = val)

  let offset = getInput('offset', val => offset = val)
  let displayLen: number = getInput('lenInput', val => displayLen = val * 60) * 60

  const maxSpeed = 0.01
  const delay = 50

  const states:state[] = []
  for (let i = 0; i < 60 * 60; i++) {
    states.push({
      realHeight: 0.01,
      wantedHeight: 0.01,
      measured: 0,
      error: 0,
      change: 0,
    })
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const h = canvas.height
    const dx = canvas.width / displayLen

    // @ts-ignore
    Object.keys(colors).forEach((type: keyof state) => {
      const start = Math.max(delay, states.length - displayLen)
      ctx.beginPath()
      ctx.moveTo(0, h * (1 - states[start][type]))
      // @ts-ignore
      ctx.strokeStyle = colors[type]
      ctx.lineWidth = 5

      for (let i = start; i < states.length; i++) {
        ctx.lineTo((i - start) * dx, (1 - states[i][type]) * h)
      }

      ctx.stroke()
    })
  }

  function measure(): number {
    return states[states.length - delay].realHeight
  }

  function pid(measured: number) {
    const wanted = 0.5
    const err = wanted - measured

    return err * P
  }

  function absMax(value: number, max: number) {
    if (value > 0) return Math.min(value, max)
    return Math.max(value, -max)
  }

  function update() {
    const measured = measure()
    const pidErr = pid(measured)
    const err = absMax(pidErr, maxSpeed)
    let real = states[states.length - 1].realHeight

    real += err + offset
    const change = (err + maxSpeed) / maxSpeed / 2

    states.push({
      realHeight: real,
      wantedHeight: 0.5,
      measured,
      error: err,
      change: change
    })

    draw()
  }

  let id = setInterval(update, 1000 / 60)
  window.addEventListener('keydown', e => {
    if (e.key == ' ') {
      if (id) {
        clearInterval(id)
        id = 0 as unknown as NodeJS.Timer
      } else {
        id = setInterval(update, 1000 / 60)
      }
    }
  })
})