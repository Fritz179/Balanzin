class SS {
  constructor() {
    this.soundsNames = ["start1"]
    this.sounds = []
    for (let i = 0; i < this.soundsNames.length; i++) {
      this.sounds[i] = loadSound("sounds/" + this.soundsNames[i] + ".wav")
    }
  }

  play(name, force = true) {
    this.soundsNames.forEach((sName, i) => {
      if (name == sName) {
        if (force) {
          this.sounds[i].play()
        } else if (!this.sounds[i].isPlaying()) {
          this.sounds[i].play()
        } else {
          console.log("sound already playing and sound not forced")
        }
      } else {
        console.log("no sound with name: " + name)
      }
    })
  }
}
