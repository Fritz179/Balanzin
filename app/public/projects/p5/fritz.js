(function IIFE(window) {
  'use strict'

    function generateFritz() {
      const fritz = Object.create(null)

      let body = {}
      let nav = {nav: false}

      let canToggleFullscreen = true

      const addGlobalCallback = (name, callback) => {
        if (typeof window[name] == 'undefined') {
          window[name] = callback
        } else {
          throw new Error(`cannot create ${name}'s callback because is already dfined'`)
        }
      }

      nav.add = el => {
        //check if nav is not existing
        if (!nav.nav) {
          nav.isOpen = false
          body = document.getElementsByTagName('body')[0]
          nav.nav = createNav()
          body.appendChild(nav.nav)
          nav.ul = document.getElementById('options')
        }

        nav.ul.appendChild(el)

        function createNav() {
          const nav = Nav()
          nav.id = 'sidenav'
          nav.innerHTML = `<ul id="options"><li class="btnli"><a href="javascript:void(0)" class="closebtn" onclick="toggleNav()">&times;</a></li></ul>`
          return nav
        }
      }

      //toggle nav
      nav.toggle = () => {
        if (nav.nav && nav.isOpen) {
          nav.isOpen = false
          nav.nav.style.width = "0";
        } else {
          nav.isOpen = true
          nav.nav.style.width = "300px";
        }
      }

      //ad events listener for fullscreen && options
      if (window.parent != window) { //iframe
        window.parent.window.onresize()
        addEvent(window.parent.window.document)
      }
      addEvent(document)

      function addEvent(doc) {
        doc.addEventListener('keydown', e => {
          keyDown(e)
        }, false);
      }

      function keyDown(e) {
        if (e.key == 'f' && canToggleFullscreen) { //fullscreen
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }
        } else if (e.key == 'Alt' && nav.nav) {  //options
          if (nav.nav) {
            e.preventDefault() //doesn't focus the options menu of chrome
            nav.toggle()
          }
        }
      }


      // --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- --- OPTIONS API --- //

      fritz.insertButton = (value = 'button', callback) => {
        const div = Li()
        div.classList.add("button");
        const button = Button(value)
        button.onclick = callback
        div.appendChild(button)

        nav.add(div)
      }

      fritz.insertP = (value = '', callbackName) => {
        const div = Li()
        div.classList.add("p");
        const p = P(value)
        addGlobalCallback(callbackName, input => p.innerHTML = value + input)
        div.appendChild(p)

        nav.add(div)
      }

      fritz.insertTitle = (title = 'Options:') => {
        const div = Li()
        div.classList.add("title");
        const h1 = H1(title)
        div.appendChild(h1)

        nav.add(div)
      }

      fritz.insertSlider = (tag, min, max, step, value, oninput) => {
        if (arguments.length == 1) {
          var {tag, min, max, step, oninput, value} = tag
        }

        test(tag, oninput)

        const div = Li()
        div.classList.add("slider");
        div.appendChild(P(tag))

        const input = Input()
        input.type = 'range'
        input.min = typeof min == undefined ? 1 : min
        input.max = max || 100
        input.step = step || 1
        input.value = value || min || 1
        div.appendChild(input)

        const label = Label(input.value)
        div.appendChild(label)

        input.oninput = () => {
          label.innerHTML = input.value
          oninput(input)
        }

        nav.add(div)
      }

      // --- Messages --- --- Messages --- --- Messages --- --- Messages --- --- Messages --- --- Messages --- --- Messages --- --- Messages ---//

      let messageFrames = 0
      let message = {}
      let messagePos = {x: window.innerWidth / 2, y: window.innerHeight / 2}

      fritz.showMessage = (type, msg, frames) => {
        messageFrames = frames || 180
        message = {type: type, msg: msg}
      }

      fritz.showMessages = () => {
        if (messageFrames > 0) {
          textSize(100)
          textAlign(CENTER)
          noStroke()
          let a = messageFrames < 50 ? 255 / 50 * messageFrames : messageFrames > 150 ? (180 - messageFrames) * 255 / 30 : 255 / 50 * messageFrames
          message.type == 'success' ? fill(0, 255, 0, a) : fill(255, 0, 0, a)
          text(message.msg, messagePos.x, messagePos.y)
          messageFrames -= 1
        }
      }

      fritz.clearMessage = remaining => {
        messageFrames = remaining || 0
      }

      fritz.messagesPos = (x, y) => {
        messagePos = {x: x, y: y}
      }

      // --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API --- --- DOM API ---//

      function test(...values) {
        let valid = values.every(val => typeof val != 'undefined')

        if (valid) {
          return true
        } else {
          throw new Error('Invalid arguments')
        }
      }

      function Nav() {
        return document.createElement('nav')
      }

      function Div() {
        return document.createElement('div')
      }

      function Input() {
        return document.createElement('input')
      }

      function Br() {
        return document.createElement('br')
      }

      function Li() {
        var li = document.createElement('li')
        li.classList.add("li");
        return li
      }

      function Hr() {
        return document.createElement('hr')
      }

      function P(txt) {
        const p = document.createElement('p')
        p.innerHTML = txt
        return p
      }

      function H1(txt) {
        const h1 = document.createElement('h1')
        h1.innerHTML = txt
        return h1
      }

      function Label(txt = 'Placeholder') {
        const label = document.createElement('label')
        label.innerHTML = txt
        return label
      }

      function Button(txt = 'Placeholder') {
        const button = document.createElement('button')
        button.innerHTML = txt
        return button
      }

      return fritz
    }

    if (!window._fritzVersion) {
      window._fritzVersion = 1
      const fritz = generateFritz()

      for (var key in fritz) {
        if (typeof window[key] == 'undefined') {
          window[key] = fritz[key]
        } else {
          console.log(`in window ${key} is already defined`);
        }
      }
    } else {
      console.warn('Fritz already available');
    }
})(window);
