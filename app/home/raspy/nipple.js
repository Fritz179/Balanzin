const nipples = document.querySelectorAll('.nipple')
let mouseX = 0, mouseY = 0

document.addEventListener('mousemove', e => {
  mouseX = e.pageX
  mouseY = e.pageY
})
document.addEventListener('touchmove', e => {
  touchobj = e.changedTouches[e.changedTouches.length]
  mouseX = touchobj.clientX
  mouseY = touchobj.clientX
})

nipples.forEach(nipple => {
  const ctx = nipple.getContext('2d')
  const sibling = nipple.parentNode.children[0]
  const w = nipple.width = sibling.clientWidth, h = nipple.height = sibling.clientHeight

  let deltaX = 0, deltaY = 0
  let nippleX = 0, nippleY = 0
  let preNippleX = -1, preNippleY = -1

  function updatePos() {
    const box = nipple.getBoundingClientRect()
    deltaX = box.left + window.scrollX
    deltaY = box.top + window.scrollY
  }

  let r = w < h ? w / 4 : h / 4

  function preventDefault(e) {
    e.preventDefault()
  }

  [['touchstart', 'touchmove'], ['mousedown', 'mousemove']].forEach(type => {
    nipple.addEventListener(type[0], () => {
      updatePos()
      nipple.classList.add('grabbing');
      document.body.classList.add('grabbing');
      document.body.classList.add('stop-scrolling');
      document.addEventListener(type[1], updateNipple)
    })
  });

  [['touchend', 'touchmove'], ['mouseup', 'mousemove']].forEach(type => {
    document.addEventListener(type[0], () => {
      nippleX = 0
      nippleY = 0
      nipple.classList.remove('grabbing');
      document.body.classList.remove('grabbing');
      document.body.classList.remove('stop-scrolling');
      document.removeEventListener(type[1], updateNipple)
    })
  });


  function updateNipple() {
    nippleX = mouseX - deltaX - w / 2
    nippleY = mouseY - deltaY - w / 2
    let d = Math.sqrt(nippleX * nippleX + nippleY * nippleY)

    if (d > r) {
      let factor = d / r
      nippleX /= factor
      nippleY /= factor

    }
  }

  function drawNipple() {
    if (preNippleX != nippleX || preNippleY != nippleY) {

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, nipple.width, nipple.height);

      ctx.beginPath();
      ctx.fillStyle  = 'red'
      ctx.arc(nippleX + w / 2, nippleY + w / 2, r, 0, 2 * Math.PI);
      // ctx.arc(Math.random() * 10 - 5 + w / 2, Math.random() * 10 - 5 + w / 2, r, 0, 2 * Math.PI);
      ctx.fill()
      ctx.stroke();

      preNippleX = nippleX
      preNippleY = nippleY
    }

    window.requestAnimationFrame(drawNipple)
  }

  window.requestAnimationFrame(drawNipple)
})
