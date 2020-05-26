class Player extends Entity {
  constructor() {
    super()
    this.setSize(50, 50)
    this.pos.set(this.size).div(-2);

    [true, false].forEach(bool => {
      const s = this[bool ? 's1' : 's2'] = this.createSprite()
      s.background(bool ? 255 : 0)
      s.fill(bool ? 0 : 255)

      s.textAlign('left', 'top')
      s.textSize(30)
      s.text('</>', 4, 13)
    })

    this.speed = 1.5
    this.drag = 0.85
    this.timer = 0

    this.flip = false
  }

  update() {
    if (++this.timer >= 10) {
      this.timer = 0

      this.s1.display(this.flip)
      this.s2.display(!this.flip)

      this.flip = !this.flip
    }
  }

  render() {
    console.log('rendering Player');
    return false
  }

  onKey({key}) {
    this.move(key, 1)
  }

  onKeyUp({key}) {
    this.move(key, -1)
  }

  move(key, dir) {
    switch (key) {
      case 'w': this.addAcc(0, -this.speed * dir); break;
      case 'a': this.addAcc(-this.speed * dir, 0); break;
      case 's': this.addAcc(0, this.speed * dir); break;
      case 'd': this.addAcc(this.speed * dir, 0); break;
      case 'Shift': this.setDrag(dir < 0 ? 0.85 : 0.925); break;
    }
  }
}
