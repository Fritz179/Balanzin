const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router()
const passport = require('passport')

const User = require('../models/User');

const checkErrors = require('../models/checkErrors')
const ensureAuthenticated = require('../setup/ensureAuthenticated');
const {check, validationResult} = require('express-validator/check');

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', [
  check('name').not().isEmpty().withMessage('Name required'),
  check('username').not().isEmpty().withMessage('Username required'),
  //check('username').custom(value => {return Users.findOne({username: value})? true: false}).withMessage('Username already in use!'),
  check('email').not().isEmpty().withMessage('Email required'),
  check('email').isEmail().withMessage('Email is not Valid'),
  check('password1').not().isEmpty().withMessage('Password required'),
  check('password2').not().isEmpty().custom((value, {req}) => req.body.password2 === req.body.password1).withMessage('Passwords do not match')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash('danger', errors.array()[0].msg)
    res.render('register')
    return
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password1, salt, (err, hash) => {
      if (err) {
        console.log(err);
        res.flash('danger', 'hash failed')
        res.redirect('/users/register')
      } else {
        const user = new User({
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: hash,
        }).save(err => {
          if (err) {
            console.log(err);
            return
          } else {
            req.flash("success", "You are now registered");
            res.redirect('/users/login')
          }
        })
      }
    });
  });
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    successFlash: true
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = router
