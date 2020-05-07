const timer = new Timer(60, () => masterLayer.runFixedUpdate(), update, false)

function onPreloaDone() {
  masterLayer = new Master()
  masterLayer.runUpdateCameraMode({useHTML: true}, window.innerWidth, window.innerHeight, 1, 1)

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

addEventListenerAfterPreload('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight

  masterLayer.runUpdateCameraMode(null, width, height, 1, 1)
});
