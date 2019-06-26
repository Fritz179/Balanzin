[...document.getElementsByClassName("clickable")].forEach(el => {
  el.onclick = () => window.location.href = el.getAttribute("redirect")
})
