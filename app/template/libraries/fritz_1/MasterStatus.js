class MasterStatus extends Status {
  constructor() {
    super()

    this.statuses = {}
    this.currentStatus = ''
    this.camera.addSpriteLayer()
  }

  createStatus(statusName, Constructor, options) {
    //(Constructor, [options])
    if (typeof statusName == 'function') return this.createStatus(deCapitalize(statusName.name), statusName, Constructor)
    if (this.statuses[statusName]) throw new Error(`Status ${statusName} already exists!`)

    //(statusName, [options])
    if (typeof Constructor != 'function') return this.createStatus(statusName, Menu, Constructor)

    //check if it extends Status
    if (!(Constructor.prototype instanceof Status)) throw new Error(`${statusName} is not a instanceof Status: ${Constructor}`)
    return this.statuses[statusName] = new Constructor(options)
  }

  setCurrentStatus(newStatus, ...args) {
    console.log(`New Status: ${newStatus}`);
    //check if the new status exist
    if (!this.statuses[newStatus]) throw new Error(`Invalid Status: ${newStatus}`)

    //create a function that runs only one time before the next statusUpdate
    //if status is swapped while updating another status, for the rest of the update status points to the new status
    function oneTime() {
      //if there was a previous status, false only on first setCurrentStatus
      if (status) status._post(...args)

      //hot-swap
      masterStatus.ecs.despawn(status)
      status = masterStatus.statuses[newStatus]
      masterStatus.ecs.spawn(status)
      masterStatus.listener.addListener(status, 'subListeners')

      status._pre(...args)

      masterStatus.setSize(windowWidth, windowHeight)
      //remove the function once it has been called
      preStatusUpdate.delete(oneTime)
    }

    preStatusUpdate.add(oneTime)
  }
}

p5.prototype.createStatus = (...args) => masterStatus.createStatus(...args)
p5.prototype.setCurrentStatus = (...args) => masterStatus.setCurrentStatus(...args)
