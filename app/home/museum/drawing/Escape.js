class Escape {
  constructor() {
    this.elements = []
    this.info = {
      w: 0,
      h: 0,
      r: 0,
      iR: 0,
      lineW: 0
    }
    this.quello = loadJSON("prefab/quello.json")
    this.asa = loadJSON("prefab/asa.json")
    this.creeper = loadJSON("prefab/creeeper.json")
  }

  start(info, home) {
    this.info.r = info[2]
    this.info.iR = info[3]
    this.info.ddd = info[4]
    if (home) {
      this.addText("By Fritz_179", width / 2, height / 5, CENTER, 50)
      this.addAll(["X-Points:", "w", info[0], "Y-Points:", "h", info[1]], width / 2, width / 50, height / 5 * 2, height / 5 * 3, 40)
      this.addButton("Start Drawing", width / 2, height / 5 * 3.5, this.goToDrowing, true, true)
      this.addText("Copyright © 2018 by Fritz_179", width / 2, height / 10 * 8, CENTER, 20)
    } else {
      this.addText("Options", width / 2, height / 8, CENTER, 50)
      this.addText("Copyright © 2018 by Fritz_179", width / 2, height / 20, CENTER, 20)
      this.addAll([
        "X-Points:", "w", info[0],
        "Y-Points:", "h", info[1],
        "Points radius:", "r", info[2],
        "Points interaction:", "iR", info[3],
        "Lines Width:", "lineW", info[5]],
         width / 2, width / 50, height / 5 * 1.2, height / 5 * 3.2, 40)
      this.addButton("Resume Drawing", width / 5 * 2, height / 5 * 3.5, this.goToDrowing, true, true)
      this.addButton("Save Drawing", width / 5 * 3, height / 5 * 3.5, this.saveDrowing, true, true)
      this.addButton("Load Quello", width / 4 * 2, height / 5 * 4, this.loadDrawingQ, true, true)
      this.addButton("Load Asa", width / 4 * 1, height / 5 * 4, this.loadDrawingA, true, true)
      this.addButton("Load Creeper", width / 4 * 3, height / 5 * 4, this.loadDrawingC, true, true)
    }
  }

  goToDrowing() {
    changeStatus("drawing", escape.info)
  }

  keyPressed(key) {
    if (key == 27 || key == 13) {
      this.goToDrowing()
    }
  }

  saveDrowing() {
    if (drawing.links) {
      let save = {
        w: drawing.w,
        h: drawing.h,
        r: drawing.r,
        iR: drawing.iR,
        links: drawing.links
      }
      saveJSON(save, "yoloooo")
    }
  }

  loadDrawingC() {
    escape.loadDrawing(escape.creeper)
  }

  loadDrawingQ() {
    escape.loadDrawing(escape.quello)
  }

  loadDrawingA() {
    escape.loadDrawing(escape.asa)
  }

  loadDrawing(json) {
    drawing.links = json.links
    let info = {
      w: json.w,
      h: json.h,
      r: json.r,
      iR: json.iR,
      ddd: json.ddd,
      lineW: 5
    }
    changeStatus("drawing", info)
    drawing.showGrid = false
  }

  addAll(lines, x, xOff, yStart, yEnd, textSize = 40) {
    let yDist = yEnd - yStart
    let ySteps = yDist / (lines.length / 3)
    for (var i = 0; i < lines.length; i += 3) {
      let y = yStart + ySteps * i / 3

      this.addText(lines[i], x - xOff, y, RIGHT, textSize)
      this.addInput(lines[i + 1], x + xOff, y, textSize / 10 , lines[i + 2])
    }
  }

  addSelect(options, x, y, f) {
    let i = this.elements.length
    this.elements[i] = createSelect(text)
    this.elements[i].position(x, y)
    options.forEach(option => {
      this.elements[i].option(option)
    })
    console.log(f)
    this.elements[i].input(f)
  }

  addButton(text, x, y, f, center, button) {
    let i = this.elements.length
    this.elements[i] = createButton(text)
    if (button) {
      this.elements[i].addClass("button")
    }
    this.elements[i].position(center ? x - this.elements[i].width / 2 - (button ? 32 : 0) : x, y)
    this.elements[i].mousePressed(f)
    //line(width / 2, 0, width / 2, height)
  }

  addInput(name, x, y, yOff, def, f) {
    let i = this.elements.length
    this.elements[i] = createInput()
    this.elements[i].position(x, y + yOff - this.elements[i].height / 2)
    if (def) {
      this.elements[i].value(def)
      eval("this.info." + name + " = " + def)
    }
    if (f) {
      this.elements[i].input(f)
    } else {
      this.elements[i].input(() => eval("this.info." + name + " = " + this.elements[i].value()))
    }
  }

  addText(t, x, y, side, size = 20) {
    textSize(size)
    textAlign(side, CENTER);
    text(t, x, y)
  }

  end() {
    for (let i = this.elements.length - 1; i >= 0; i--) {
      this.elements[i].remove()
    }
  }
}
