window.onresize = () => {
  let nav = document.getElementById('nav').clientHeight
  let iframe = document.getElementById("iframe")
  iframe.style.height = (window.innerHeight - nav) + 'px'
  // con = document.getElementById('iframeContainer').clientHeight
  // document.getElementById('nav-placeholder').style.height = nav + 'px'
  // console.log(window.innerHeight, nav, window.innerHeight - nav);
}

window.onload = () => {
  window.onresize()
};
