const express = require('express');
const router = express.Router()

const Article = require('../models/Article');
const User = require('../models/User');
const Project = require('../models/Project');
const Card = require('../models/Card');
const Wwe_Card = require('../models/Wwe_Card');
const Wwe_Game = require('../models/Wwe_Game');

const checkErrors = require('../models/checkErrors')
const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator/check');

const collections = {
  Project: ['path', 'scripts', 'name'],
  Card: ['title', 'body', 'redirect', 'src'],
  Wwe_Card: ['title', 'body', 'redirect', 'src'],
  Wwe_Game: ['name', 'foto', 'logo', 'move']
}

router.get('/:collection/:type', (req, res) => {
  let params = collections[req.params.collection]
  if (req.params.type == 'edit') {
    params.push('id')
  }
  res.render('collection', {params: params, type: req.params.type, collection: req.params.collection})
})

router.post('/:collection/:type', [
  // check('path').not().isEmpty().withMessage('Path required'),
  // check('scripts').not().isEmpty().withMessage('Scripts required'),
  // check('name').not().isEmpty().withMessage('Name required'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash('danger', errors.array()[0].msg)
    res.redirect(`/admin/${req.params.collection}/${req.params.type}`)
    return
  }

  if (req.params.type == 'edit') {
    console.log('amo da fa');
    res.render('error', {error: 'hehe'})
  } else {
    const model = eval(`new ${req.params.collection}`)
    if (req.body.scripts) [
      req.body.scripts = req.body.scripts.split(',')
    ]
    collections[req.params.collection].forEach(param => {
      model[param] = req.body[param]
    })
    model.save(err => {
      if (err) {
        console.log(err);
        return
      } else {
        req.flash("success", "Model Added");
        res.redirect(`/admin/${req.params.collection}/${req.params.type}`)
      }
    })
  }
})

module.exports = router
