function roomTutto() {
  rooms.mostra()
}

class room{
  constructor(er, r) {
    this.er = er
    this.r = r
  }

  mostra() {
    fill(153, 76, 0)
    noStroke()
    rect(0, 0, width, this.r)      //top
    rect(0, 0, this.er, height)    //right
    rect(width - this.er, 0, this.er, height)
    rect(0, height - this.r, width, this.r )
    strokeWeight(4)
    stroke(0)
    line(this.er, this.r, width - this.er, this.r)
    line(this.er, this.r, this.er, height - this.r)
    line(this.er, height - this.r, width - this.er, height - this.r)
    line(width - this.er, this.r, width - this.er, height - this.r)

    textAlign(CENTER);
    textSize(20)
    strokeWeight(1)
    fill(0)
    text("YOUR SCORE IS: " + floor(score), width / 2, this.r / 2);

    let uM = height / 5   // um = uppper margin
    let lM = this.er / 2  // lM = left margin
    let spacing = height / 2 / 6
    textSize(20)
    strokeWeight(1)
    fill(0)
    text("hp: " + players.hp, lM, uM + spacing)
    text("dmg: " + players.bulletStats.dmg, lM, uM + spacing * 2)
    text("speed: " + players.speed, lM, uM + spacing * 3)
    text("range: " + players.bulletStats.t, lM, uM + spacing * 4)
    text("blt speed: " + players.bulletStats.countdownFixed, lM, uM + spacing * 5)
    text("level: " + level, lM, uM + spacing * 6)

    if (lagT > 0) {
      //console.log(dT)
      textSize(50)
      textAlign(CENTER);
      fill(255, 0, 0)
      text("LAG!", width - rooms.er / 2, height - rooms.r);
      textSize(20)
      text("+ " + offDT + " dT", width - rooms.er / 2, height - rooms.r / 2);
      lagT -= 1
    } else if (dT > 2) {
      offDT = round(dT * 1000) - 1000
      lagT = 50
    }

  }

  update() {

  }
}
