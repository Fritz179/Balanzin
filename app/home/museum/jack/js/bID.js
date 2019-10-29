export default class bID {
  constructor() {
    this.names = []
    this.id = {}
    this.blocks = []
  }

  define(block) {
    block.forEach((block, i) => {
      this.names.push(block.name)
      this.blocks.push(block)
      this.id[block.name] = this.names.length -1
    })
  }

  getID(name) {
    let output = this.id[name]
    if (output || output === 0) {
      return output
    } else {
      console.log("Errore nel getID, " + name + " non è presente");
      alert("Errore nel getID, " + name + " non è presente")
      debugger;
    }
  }

  getName(id) {
    let output = this.names[id]
    if (output) {
      return output
    } else {
      console.log("Errore nel getName, " + id + " non è presente");
      alert("Errore nel getName, " + id + " non è presente")
      debugger;
    }
  }

  isSolid(id) {
    return this.blocks[id].isSolid
  }
}
