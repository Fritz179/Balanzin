const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const path = require('path');

const User = require('../../../../models/User');

module.exports = ({router, directory}) => {
  router.get('/', (req, res) => {
    res.render(path.join(directory, 'index.ejs'))
  })

  router.post('/', [
    check('name').not().isEmpty().withMessage('Name required'),
    check('username').not().isEmpty().withMessage('Username required'),
    check('email').not().isEmpty().withMessage('Email required'),
    check('email').isEmail().withMessage('Email is not Valid'),
    check('password1').not().isEmpty().withMessage('Password required'),
    check('password2').not().isEmpty().custom((value, {req}) => req.body.password2 === req.body.password1).withMessage('Passwords do not match')
  ], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      errors.array().forEach(msg => req.flash('error', msg.msg))
      res.redirect('/users/register')
      return
    }

    User.findOne({username: req.body.username}, (err, user) => {
      if (err) {
        res.flash('error', 'Internal server Error, please report incident! no DB?')
        res.redirect('/users/register')
        return
      }

      if (user) {
        req.flash('error', 'Username already in use!')
        res.redirect('/users/register')
        return
      }

      createUser(req, res)
    })
  })
}

function createUser(req, res) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password1, salt, (err, hash) => {
      if (err) {
        console.log(err);
        res.flash('error', 'Internal server Error, please report incident! hash failed?')
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
            res.flash('error', 'Internal server Error, please report incident!')
            res.redirect('/users/login')
            return
          } else {
            const {name, username, email} = req.body
            console.log(`New user created! name: ${name}, username: ${username}`);
            req.flash("success", "You are now registered");
            res.redirect('/users/login')
          }
        })
      }
    });
  });
}
