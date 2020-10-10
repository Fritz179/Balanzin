// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const {useEffect, useRef} = React

const useCanvas = (draw, w = 100, h = 100, loop) => {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')
    let request

    const render = () => {
      draw(ctx)
      request = window.requestAnimationFrame(render)
    }

    if (loop) {
      render()
    } else {
      draw(ctx)
    }

    return () => window.cancelAnimationFrame(request)
  }, [draw])

  return ref
}
