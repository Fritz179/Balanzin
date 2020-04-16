class Master extends HTMLLayer {
  constructor() {
    super()

    this.addChild(this.main = new Main(this))
  }

  update() {
    return true
  }
}

class Main extends Layer {
  constructor(parent) {
    super({from: parent, size: 'fill'})
  }

  render() {
    this.background(51)
  }
}

// window.addEventListener('load', () => {
//   const w = window.innerWidth
//   const h = window.innerHeight
//
//   canvas1 = document.getElementById('screen1')
//   canvas1.width = 100
//   canvas1.height = 200
//   canvas2 = document.getElementById('screen2')
//   canvas2.width = 100
//   canvas2.height = 200
//   ctx1 = canvas1.getContext('2d')
//   ctx2 = canvas2.getContext('2d')
//   ctx1.imageSmoothingEnabled = false
//
//   ctx1.fillStyle = 'blue';
//   ctx1.fillRect(0,0,w,h);
//
//   ctx1.fillStyle = 'green';
//   ctx1.translate(0.5, 0.5)
//   ctx1.beginPath();
//   ctx1.moveTo(51, 0);
//   ctx1.lineTo(51, 100);
//   ctx1.stroke();
//   ctx1.translate(-0.5, -0.5)
//
//   ctx2.fillStyle = 'red';
//   ctx2.fillRect(0,0,w,h);
// })
//
// // let ctx2, ctx1, canvas2, w, h
// //
// // window.addEventListener('load', () => {
// //   w = window.innerWidth
// //   h = window.innerHeight
// //
// //   canvas1 = document.getElementById('screen1')
// //   canvas1.width = w
// //   canvas1.height = h
// //   canvas2 = document.createElement('canvas')
// //   canvas2.width = w
// //   canvas2.height = h
// //   ctx1 = canvas1.getContext('2d')
// //   ctx2 = canvas2.getContext('2d')
// //
// //   ctx1.fillStyle = 'red';
// //   ctx1.fillRect(0,0,w,h);
// //
// //   requestAnimationFrame(draw)
// // })
// //
// // let color = 0
// //
// // function draw() {
// //   ctx2.fillStyle = `rgb(${color}, ${255 - color}, 0)`;
// //   ctx2.fillRect(50,50,w -150,h -150);
// //
// //   color = color == 255 ? 0 : color + 1
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //   ctx1.drawImage(canvas2, 0, 0)
// //
// //   requestAnimationFrame(draw)
// // }
