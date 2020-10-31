export default class HTMLDiv {
  constructor(id, master) {
    if (typeof id == 'string') {
      master.div = document.getElementById(id)
    } else {
      master = id
      master.div = document.createElement('div')
      master.events.listen('register', (listen, parent) => {
        parent.div.appendChild(master.div)
      })
    }

    master.div.id = master.constructor.name
  }
}
