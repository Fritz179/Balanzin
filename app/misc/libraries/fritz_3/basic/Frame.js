/*
  Base class for everything more than a Block
  Has all action functions (onKey etc..)
  Has update and fixedUpdate
*/

class Frame extends RenderInterface {
  constructor(x, y, w, h) {
    super(x, y, w, h)

    this._wasOnClick = false  // for onMouse and onClick distinction
    this._hovered = false     // for hovered

    this.changed = true
  }
};

// I/O events
['Key', 'KeyUp', 'Wheel', 'Hover', 'Unhover', 'Drag'].forEach(dir => {
  Frame.prototype[`on${dir}`] = () => { }
  Frame.prototype[`on${dir}Bubble`] = () => { }
});

// I/O mouse events
['Mouse', 'Click'].forEach(name => {
  ['', 'Drag', 'Up'].forEach(action => {
    ['', 'Left', 'Middle', 'Right'].forEach(dir => {
      Frame.prototype[`on${dir}${name}${action}`] = () => { }
      Frame.prototype[`on${dir}${name}${action}Bubble`] = () => { }
    })
  })
});

createMiddleware(Frame, 'update')
createMiddleware(Frame, 'fixedUpdate')

Object.defineProperty(Frame.prototype, 'sprite', {
  get: function() {
    console.error(this);
    throw new Error('Cannot acces unexisting sprite')
  },
  set: function(value) {
    if (value) {
      Object.defineProperty(this, 'sprite', {value, writable: true})
    } else {
      console.error(this);
      throw new Error('Cannot assign empty sprite!')
    }
  }
})
