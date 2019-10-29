'use strict'

import {loadJSON, loadImage, loadImages} from './loaders.js'
import Level from './Level.js'

const canvas = document.getElementById('screen')
const context = canvas.getContext('2d')
canvas.width = window.screen.width
canvas.height = window.screen.height

// Questo gioco è dedicato
// a Maura Isepponi <3

  Promise.all([
    loadImages('tiles', 'jack', 'defaultTexture'),
    loadJSON('./json/definer.json'),
  ]).then(([imgs, definer]) => {

    const level = new Level(context, definer, imgs)
    level.start()
  });
