var i1
var i2
var i3
var i4
var i5
var p1;
var p2;
var p3;
var b1;
var b2;
var b3;
var b4;
var games
var gamestatus = "home"
var pressed = false
var sounds = {}
var img
var img2

function preload() {
  sounds.pot = loadSound('Sounds/nome.m4a');
  img = loadImage("Images/rem.png");
  img2 = loadImage("Images/costa.png");

  cSound = loadSound('Sounds/nome.m4a');
}

function setup() {
  createCanvas(windowWidth, windowHeight)
}

function draw() {
  if (gamestatus == "gioca") {
    games.gioca()
  } else if (gamestatus != "wait") {
    if (gamestatus == "home") {
      home()
    } else if (gamestatus == "normale") {
      normale()
    } else if (gamestatus == "challenge") {
      challenge()
    } else if (gamestatus == "custom") {
      custom()
    } else if (gamestatus == "gameover") {
      gameover()
    }
    gamestatus = "wait"
  }
}

function home() {
  reset()
  background(51)
  p1 = createP("BENVENUTO IN RAFT!!<br><br>SCEGLI LA MODALIT&Aacute")
  p1.position(windowWidth / 2 - 300, 100)
  p1.addClass("home")
  let d = windowWidth / 4
  b1 = createButton("normale")
  b1.position(d - b1.width / 2, windowHeight / 1.5)
  b1.addClass("bottone")
  b1.mousePressed(() => gamestatus = "normale")
  b2 = createButton("challenge")
  b2.position(d * 2 - b2.width / 2, windowHeight / 1.5)
  b2.addClass("bottone")
  b2.mousePressed(() => gamestatus = "challenge")
  b3 = createButton("custom")
  b3.position(d * 3 - b3.width / 2, windowHeight / 1.5)
  b3.addClass("bottone")
  b3.mousePressed(() => gamestatus = "custom")
}

function normale() {
  reset()
  background(51)
  p1 = createP("MODALIT&Aacute NORMALE<br><br>SCEGLI LA DIFFICOLT&Aacute")
  p1.position(windowWidth / 2 - 300, 100)
  p1.addClass("home")
  let d = windowWidth / 4
  b1 = createButton("difficile")
  b1.position(d - b1.width / 2, windowHeight / 1.5)
  b1.addClass("bottone")
  b1.mousePressed(() => games = new game(3, 0.001, 17, 500))                                   //
  b2 = createButton("famelico")
  b2.position(d * 2 - b2.width / 2, windowHeight / 1.5)
  b2.addClass("bottone")
  b2.mousePressed(() => games = new game(3, 0.002, 22, 250))                                   //
  b3 = createButton("impossibile")
  b3.position(d * 3 - b3.width / 2, windowHeight / 1.5)
  b3.addClass("bottone")
  b3.mousePressed(() => games = new game(3, 0.003, 30, 100))
  b4 = createButton("indietro")
  b4.position(d * 2 - b4.width / 2, windowHeight / 1.25)
  b4.addClass("bottone")
  b4.mousePressed(() => gamestatus = "home")                                //
}

function challenge() {
  reset()
  background(51)
  p1 = createP("MODALIT&Aacute CHALLENGE<br><br>SCEGLI LA MODALIT&Aacute")
  p1.position(windowWidth / 2 - 300, 100)
  p1.addClass("home")
  let d = windowWidth / 4
  b1 = createButton("pot")
  b1.position(d - b1.width / 2, windowHeight / 1.5)
  b1.addClass("bottone")
  b1.mousePressed(() => games = new game(3, 0.002, 22, 250, "pot"))                                   //
  b2 = createButton("random hard")
  b2.position(d * 2 - b2.width / 2, windowHeight / 1.5)
  b2.addClass("bottone")
  b2.mousePressed(() => games = new game(3, 0.002, 22, 250, "rH"))                                   //
  b3 = createButton("sparafleshante")
  b3.position(d * 3 - b3.width / 2, windowHeight / 1.5)
  b3.addClass("bottone")
  b3.mousePressed(() => games = new game(3, 0.002, 22, 250, "sF"))
  b4 = createButton("indietro")
  b4.position(d * 2 - b4.width / 2, windowHeight / 1.25)
  b4.addClass("bottone")
  b4.mousePressed(() => gamestatus = "home")
}

function custom() {
  reset()
  background(51)
  p1 = createP("MODALIT&Aacute CUSTOM<br>un po' buggata...")
  p1.position(windowWidth / 2 - 300, 65)
  p1.addClass("home")
  p2 = createP("scegli i parametri e premi fatto")
  p2.position(windowWidth / 2 - 280, 250)
  p2.addClass("custom")
  //q == quanti cubi, aa == velocità giro, v = velocità lineare, delay = prima di girare, challengeType
  p3 = createP("densit&aacute<br><br>rotazione<br><br>velocit&aacute<br><br>delay<br><br>challengeType")
  p3.position(windowWidth / 2 - 350, 350)
  p3.addClass("custom")
  if (games) {
    i1 = createInput(games.q)
    i2 = createInput(games.aa)
    i3 = createInput(games.v)
    i4 = createInput(games.delay)
    i5 = createInput(games.cT)
  } else {
    i1 = createInput()
    i2 = createInput()
    i3 = createInput()
    i4 = createInput()
    i5 = createInput()
  }
  i1.position(windowWidth / 2.1, 400)
  i1.addClass("inp")
  i2.position(windowWidth / 2.1, 480)
  i2.addClass("inp")
  i3.position(windowWidth / 2.1, 555)
  i3.addClass("inp")
  i4.position(windowWidth / 2.1, 635)
  i4.addClass("inp")
  i5.position(windowWidth / 2.1, 720)
  i5.addClass("inp")
  let d = windowWidth / 4
  b1 = createButton("indietro")
  b1.position(d * 1.65, windowHeight / 1.15)
  b1.addClass("bottone")
  b1.mousePressed(() => gamestatus = "home")
  b2 = createButton("inizia")
  b2.position(d * 1.66, windowHeight / 1.25)
  b2.addClass("bottone")
  b2.mousePressed(() => games = new game(Number(i1.value()), Number(i2.value()), Number(i3.value()), Number(i4.value()), i5.value()))
}

function gameover() {
  reset()
  background(51)
  p1 = createP("GAMEOVER<br><br>" + games.p)
  p1.position(windowWidth / 2 - 120, 100)
  p1.addClass("home")
  let d = windowWidth / 2
  b1 = createButton("HOME")
  b1.position(d - b1.width / 2, windowHeight / 1.3)
  b1.addClass("bottone")
  b1.mousePressed(() => gamestatus = "home")
  b2 = createButton("RESTART")
  b2.addClass("restart")
  b2.position(d - 200, windowHeight / 2.2)
  b2.mousePressed(() => games = new game(games.q, games.aa, games.v, games.delay, games.cT))                                  //
}

function reset() {
  if (i1)
  i1.remove()
  if (i2)
  i2.remove()
  if (i3)
  i3.remove()
  if (i4)
  i4.remove()
  if (i5)
  i5.remove()
  if (p1)
  p1.remove()
  if (p2)
  p2.remove()
  if (p3)
  p3.remove()
  if (b1)
  b1.remove()
  if (b2)
  b2.remove()
  if (b3)
  b3.remove()
  if(b4)
  b4.remove()
}


function mousePressed() {
  if (gamestatus == "gioca") {
    games.pressed()
  }
}
