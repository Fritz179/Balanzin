class Player extends Entity {
  constructor() {
    super()
    this.setSize(50, 50)
    this.background(0)

    this.speed = 10
  }

  render() {
    console.log('rendering Player');
    return this.sprite
  }

  onKey({key}) {
    this.move(key, 1)
  }

  onKeyUp({key}) {
    this.move(key, -1)
  }

  move(key, dir) {
    switch (key) {
      case 'w': this.addVel(0, -this.speed * dir); break;
      case 'a': this.addVel(-this.speed * dir, 0); break;
      case 's': this.addVel(0, this.speed * dir); break;
      case 'd': this.addVel(this.speed * dir, 0); break;
    }
  }
}
