var finito = false;
var vinto = false;
var vinto2 = true
var paused = false
var score = 150
var time = -1
var mT;
var lagT;
var offDT;
let fps = 75

function gamepaused() {
  background(51)
  textSize(60)
  textAlign(CENTER);
  fill(0)
  text("THE GAME IS PAUSED, PRESS SPACE TO UNPAUSE", width / 2, height / 2);
}

function gameover() {
  textSize(100)
  textAlign(CENTER);
  fill(0)
  if (vinto) {
    if (vinto2) {
      sounds.win.play()
      vinto2 = false
    }
    background(0, 255, 0)
    text("YOU WON", width / 2, height / 2);
  } else {
    if (vinto2) {
      sounds.lose.play()
      vinto2 = false
    }
    background(255,0 , 0)
    text("GAME OVER", width / 2, height / 2);
  }
  textSize(20)
  strokeWeight(1)
  text("press space to restart!!", width / 2, height / 10 * 6)
  text("total score: " + round(score), width / 2, height / 5)
}

function restart() {
  vinto2 = true
  sounds.win.stop()
  sounds.lose.stop()
  score = 150
  bullets = []
  enemys = []
  splashes = []
  players = undefined
  players = new player()
  finito = false
  vinto = false
  paused = false
  level = 0
  enemyTutto()
}


function cheat() {
  if (keyIsDown(188)) {
    finito = true
    vinto = true
  }
  if (keyIsDown(190)) {
    finito = true
    vinto = false
  }
  if (keyIsDown(189)) {
    enemys.splice(0, enemys.length)
    restart()
  }
  if (keyIsDown(220)) {
    enemys.splice(0, enemys.length)
    level -= 1
    enemyTutto()
  }
  if (keyIsDown(222)) {
    enemys.splice(0, enemys.length)
  }
  if (keyIsDown(223)) {
    players.hp += 1
  }
  if (keyIsDown(27)) {
    paused = !paused
  }
  if (finito) {
    if (keyIsDown(32)) {
      restart()
    }
  }
  if (keyIsDown(67)) {
    if (getMasterVolume() == 0) {
      masterVolume(1, 1)
    } else {
      masterVolume(0, 1)
    }
  }
}

function aggiornaDeltaTime() {
  pMT = mT                          //pMT = previus millisecnds time
  mT = millis()                     //mT = milliseconds time
  let tD = mT - pMT                 //tD = time distance betwen each frame
  var dT = tD * fps / 1000          //dT = delta time
  return(dT)
}
