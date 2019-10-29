export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image()
    image.addEventListener('load', () => {
      resolve(image)
    })
    image.src = url
  })
}

export function loadJSON(url) {
  return fetch(url)
  .then((r) =>
    r.json())
}

export function loadImages(...urls) {
  return new Promise(resolve => {
    let promises = []
    urls.forEach(url => {
      promises.push(loadImage('./img/' + url + '.png'))
    })
    Promise.all(promises).then(([...imgs]) => {
      let output = {}
      imgs.forEach((img, i) => {
        output[urls[i]] = img
      })
      resolve(output)
    })
  })
}

// export function loadImages(...urls) {
//   return new Promise(resolve => {
//     let promises = []
//     urls.forEach(url => {
//       promises.push(new Promise(resolve => {
//         const image = new Image()
//         image.addEventListener('load', () => {
//           resolve(image)
//         })
//         image.src = '../img/' + url + '.png'
//       }))
//     })
//     Promise.all(promises).then(([...imgs]) => {
//       let output = {}
//       imgs.forEach((img, i) => {
//         output[urls[i]] = img
//       })
//       resolve(output)
//     })
//   })
// }
