class HTMLLayer extends Layer {
  constructor(location = 'screen') {
    super({mode: 'custom'})

    if (location) {
      this.div = document.getElementById(location)
      this.div.classList.add('app')
    } else {
      console.log('TODO');
    }
  }

  onChildrenAdded(child) {
    console.log(child.sprite.to.canvas);
    this.div.appendChild(child.sprite.to.canvas)
  }

  render() {
    this.forEachChild(child => {
      child.render()
    })
  }
}
