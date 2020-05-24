let preloadCounter = 1
const preloadFunctions = []
const eventListeners = []

function addEventListenerAfterPreload(...args) {
  eventListeners.push(args)
}

function incrementPreloadCounter() {
  if (timer.running) {
    timer.stop()
  }

  return preloadCounter++
}

function decrementPreloadCounter(index, callback) {
  preloadFunctions[index] = callback
  preloadCounter--

  if (preloadCounter == 0) {
    preloadFunctions.forEach(fun => fun())
    preloadFunctions.splice(0)

    // Cannot do:
    // Promise.resolve().then(() => { });

    // Because of:
    // Promise.resolve().then(() => console.log(1)).then(() => console.log(2));
    // Promise.resolve().then(() => console.log(3)).then(() => console.log(4));
    // => 1
    // => 3
    // => 2
    // => 4

    setTimeout(onPreloaDone)
  }
}

window.addEventListener('load', (event) => {
  decrementPreloadCounter(0, () => { })
});

function addDefaultOptions(target, source) {
  for (let key in source) {
    if (typeof target[key] == 'undefined') {
      target[key] = source[key]
    }
  }
  return target
}

function addToOptions(target, source) {
  for (let key in source) {
    if (typeof target[key] != 'undefined') {
      target[key] = source[key]
    }
  }
  return target
}

function separate(args, options) {
  if (typeof args[args.length - 1] == 'object') {
    options = addToOptions(options, args.splice(args.length - 1)[0])
  }

  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] == 'string') {
      if (typeof options[args[i]] == 'undefined') {
        throw new Error(`Invalid argument: ${args[i]}, valid options: ${Object.keys(options).join()}`)
      } else {
        options[args[i]] = true
        args.splice(i, 1)
      }
    }
  }

  return {args, options}
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function deCapitalize(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function loadImage(url, callback) {
  if (typeof callback == 'function') {
    _loadImage(url).then(img => callback(img))
  } else if (callback && typeof callback.callback == 'function') {
    _loadImage(url).then(img => callback.callback(img))
  } else {
    if (typeof callback == 'string') {
      url = `${callback}/${url}`
    }

    const img = new Image()
    _loadImage(url, img)
    return img
  }
}

function _loadImage(url, image) {
  if (!image) image = new Image();
  const count = incrementPreloadCounter()

  return new Promise(resolve => {
    image.addEventListener('load', () => {
      decrementPreloadCounter(count, () => {
        resolve(image)
      })
    });
    image.src = url;
  })
}

function loadJSON(url, callback) {
  if (typeof callback == 'function') {
    return _loadJSON(url).then(json => callback(json))
  } else if (callback && typeof callback.callback == 'function') {
    return _loadJSON(url).then(json => callback.callback(json))
  } else {
    let ret = {}

    if (callback) {
      ret = []
    }

    _loadJSON(url).then(json => {
      for (const key in json) {
        ret[key] = json[key]
      }
    })

    return ret
  }
}

function _loadJSON(url) {
  const count = incrementPreloadCounter()

  return new Promise(resolve => {
    fetch(url).then(res => {
      res.json().then(json => {
        decrementPreloadCounter(count, () => {
          resolve(json)
        })
      })
    })
  });
}

function getColor(args) {
  if (args.length == 1 && typeof args[0] == 'string') return args[0]
  const {r, g, b, a} = getRGBA(...args)
  if (a == 1) return `rgb(${r}, ${g}, ${b})`
  else return `rgba(${r}, ${g}, ${b}, ${a})`
}

function getRGBA(...args) {
  let r, g, b, a

  switch (args.length) {
    case 1: r = g = b = args[0]; a = 1; break;
    case 2: r = g = b = args[0]; a = args[1]; break;
    case 3: r = args[0]; g = args[1]; b = args[2]; a = 1; break;
    case 4: r = args[0]; g = args[1]; b = args[2]; a = args[3]; break;
    default: throw new Error(`Invalid color args len: ${args.length}`)
  }

  return {r, g, b, a}
}
