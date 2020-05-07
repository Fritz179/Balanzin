const timer = new Timer(60, () => masterLayer.runFixedUpdate(), update, false)

function onPreloaDone() {
  masterLayer = new Master()
  masterLayer.updateCameraMode({useHTML: true}, window.innerWidth, window.innerHeight)

  // add sprite/container to document if not prenset
  const node = masterLayer.useHTML ? masterLayer.container : masterLayer.sprite.canvas
  if (!document.contains(node)) {
    document.body.appendChild(node)
  }

  eventListeners.forEach(listener => {
    window.addEventListener(...listener)
  });

  if (timer.running) console.error('Erur?');
  else timer.start()
}

let redrawAll = false
function update() {
  updateMouseHover()
  redrawAll = redrawAll || debugEnabled

  if (masterLayer.runUpdate() || masterLayer.changed || redrawAll) {
    masterLayer.runRender({useHTML: true})
    masterLayer.changed = false
    redrawAll = false
    return true
  }
}
