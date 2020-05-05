const timer = new Timer(60, () => masterLayer.runFixedUpdate(), update, false)

function onPreloaDone() {
  masterLayer = new Master()
  masterLayer.updateCameraMode(null, window.innerWidth, window.innerHeight)

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
    masterLayer.runRender(masterLayer)
    masterLayer.changed = false
    redrawAll = false
    return true
  }
}
