const express = require('express');
const router = express.Router()

const Project = require('../models/Project');

const checkErrors = require('../models/checkErrors')
const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator/check');


router.get('/:name', (req, res) => {
  Project.findOne({name: req.params.name}, checkErrors(req, res, project => {
    res.render('project', {project: project})
  }))
})

module.exports = router
