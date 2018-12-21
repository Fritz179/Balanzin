const express = require('express');
const router = express.Router()

const Project = require('../models/Project');

const checkErrors = require('../models/checkErrors')
const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator/check');

const projects = ['Sevem_Segment_Display']

router.get('/:name', (req, res) => {
  if (projects.has(req.params.name)) {
    res.render('projects/project')
  }
})

module.exports = router
