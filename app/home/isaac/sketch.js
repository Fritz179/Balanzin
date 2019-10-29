var rooms;
var players;
var bullets = [];
var sounds = {}
var img = {}

function preload() {
  sounds.damage = loadSound('Sounds/damage.m4a')
  sounds.win = loadSound('Sounds/win.m4a')
  sounds.lose = loadSound('Sounds/lose.m4a')
  sounds.arrow = loadSound('Sounds/arrow.m4a', () => sounds.arrow.amp(0.1))
  sounds.vibrate = loadSound('Sounds/vibrate.wav')
  sounds.heart = loadSound('Sounds/heart_beat.mp3')
}

function setup() {
  sounds.overdrive = loadSound('Sounds/baseline.wav', () => sounds.overdrive.loop())
  sounds.overdrive.setVolume(0.3)
  createCanvas(windowWidth, windowHeight)
  background(0)
  mT = millis()
  rooms = new room(150, 50)
  players = new player()
  //sounds.overdrive.play()
}

function draw() {
  dT = aggiornaDeltaTime()
  if (!finito && !paused) {
    background(255, 178, 102)
    bulletsTutto()
    enemyTutto()
    splashesTutto()
    playerTutto()
    roomTutto()
  } else if (finito) {
    gameover()
  } else {
    gamepaused()
  }
}

function keyPressed() {
  cheat()
}
