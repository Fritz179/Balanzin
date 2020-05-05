class LayerCompositor extends Layer {
  constructor(cameraMode) {
    super(cameraMode)

    this.useHTML = this.constructor.html
  }
}
