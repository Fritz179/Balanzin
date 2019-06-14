const {check, validationResult} = require('express-validator/check');
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
    //check('username').custom(value => {return Users.findOne({username: value})? true: false}).withMessage('Username already in use!'),
    check('email').not().isEmpty().withMessage('Email required'),
    check('email').isEmail().withMessage('Email is not Valid'),
    check('password1').not().isEmpty().withMessage('Password required'),
    check('password2').not().isEmpty().custom((value, {req}) => req.body.password2 === req.body.password1).withMessage('Passwords do not match')
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('danger', errors.array()[0].msg)
      res.render('users/register')
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
}
