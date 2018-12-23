window.onload = () => {
  let iframe = document.getElementById("iframe")

  window.onresize = () => {
    let nav = document.getElementById('nav').clientHeight
    iframe.style.height = (window.innerHeight - nav) + 'px'
    // con = document.getElementById('iframeContainer').clientHeight
    // document.getElementById('nav-placeholder').style.height = nav + 'px'
    // console.log(window.innerHeight, nav, window.innerHeight - nav);
  }
  window.onresize()

  document.addEventListener('keydown', e => {
    keyDown(e)
  }, false);

  iframe.contentWindow.document.addEventListener('keydown', e => {
    keyDown(e)
  }, false);
};


let a = []
function keyDown(e) {
  if (e.key == 'f') { //fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  } else if (e.key == 'Alt') {  //options
    e.preventDefault() //doesn't focus the options menu of chrome
    if (this.isOpen) {
      this.isOpen = false
      closeNav()
    } else {
      this.isOpen = true
      openNav()
    }
  } else if (e.key == 't') {
    for (let i = 0; i < 1920 * 1080; i++) {
      a.push({x: r(1920), y: r(1080)})
    }
  } else if (e.key == 'z') {
    a.forEach(point => {
      point.x += 1
      point.y += 1
    })
  }
}

function r(max) {
  return Math.floor(Math.random() * max)
}


function openNav() {
  var nav = document.getElementById("sidenav")
  nav.style.width = "300px";
}

function closeNav() {
  var nav = document.getElementById("sidenav")
  nav.style.width = "0";
}
