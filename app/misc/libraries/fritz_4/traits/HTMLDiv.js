export default class HTMLDiv {
  constructor(id, master) {
    if (typeof id == 'string') {
      master.div = document.getElementById(id)
    } else {
      master.div = document.createElement('div')
      master.events.listen('register', (listen, parent) => {
        parent.div.appendChild(master.div)
      })
    }
  }
}
