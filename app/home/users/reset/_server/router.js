const path = require('path');
const nodemailer = require("nodemailer");
const User = require('../../../../models/User');
const bcrypt = require('bcryptjs');

const changing = {}

function randomString(len = 16) {
  const selection = '_qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM'

  let out = ''

  for (let i = 0; i < len; i++) {
    out += selection[Math.floor(Math.random() * selection.length)]
  }

  return out + '179'
}

module.exports = ({router, directory}) => {
  router.get('/', (req, res) => {
    res.render(path.join(directory, 'index.ejs'))
  })

  router.post('/', (req, res, next) => {
    const {username, email} = req.body

    if (!username || !email) {
      req.flash('error', 'Missing parameters')
      res.redirect('/users/reset')
      return
    }

    User.findOne({username}, (err, user) => {
      if (err) {
        req.flash('error', 'Internal server Error, please report incident! no DB?')
        res.redirect('/users/reset')
        return
      }

      if (!user) {
        req.flash('error', 'Invalid username')
        res.redirect('/users/reset')
        return
      }

      if (email != user.email) {
        req.flash('error', 'Invalid email!')
        res.redirect('/users/reset')
        return
      }

      const token = randomString(32)
      changing[token] = username
      setTimeout(() => { delete changing[token] }, 1000 * 60 * 60)

      sendEmail(req, res, token, username, email)
    })
  })

  router.get('/:token', (req, res) => {
    const {token} = req.params

    if (!changing[token]) {
      req.flash('error', 'Token expired')
      res.redirect('/users/reset')
      return
    }

    res.render(path.join(directory, '/confirm'), {token})
  })

  router.post('/:token', (req, res) => {
    const {password1, password2} = req.body
    const {token} = req.params

    if (!changing[token]) {
      req.flash('error', 'Token expired')
      res.redirect('/users/reset')
      return
    }

    if (!password1 || password1 != password2) {
      req.flash('error', 'Passwords do not match!')
      res.render(path.join(directory, '/confirm'), {token})
      return
    }

    changePassword(req, res, changing[token], password1)
    delete changing[token]
  })
}

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: process.env.USERNAME,
       pass: process.env.PASSWORD
    }
});

function sendEmail(req, res, token, username, email) {
    const message = {
        from: 'balanzin.ch <balanzin.server@gmail.com>',
        to: email,
        subject: `Reset password`,
        html: `<h3>Hello ${username}</h3><p>Cick
        <a href="https://www.balanzin.ch/users/reset/${token}">HERE</a>
        to reset your password!</p>`,
    }

    transport.sendMail(message, (err, info) => {
      if (err) {
        req.flash('error', 'Failed attempt to send email!!')
        res.redirect('/users/reset')
        return
      }

      req.flash('info', 'Email sent, check your email, allow up to a minute')
      res.redirect('/users/reset')
    })
}

function changePassword(req, res, username, newPassword) {
  User.findOne({username}, (err, user) => {
    if (err || !user) {
      req.flash('error', 'Internal server Error, please report incident! no DB?')
      res.redirect('/users/reset')
      return
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) {
          req.flash('error', 'Internal server Error, please report incident! no hash?')
          res.redirect('/users/reset')
          return
        }

        user.password = hash

        user.save(err => {
          if (err || !user) {
            req.flash('error', 'Internal server Error, please report incident! no save?')
            res.redirect('/users/reset')
            return
          }

          req.flash('success', 'Password reset!')
          res.redirect('/users/login')
        })
      });
    });
  })
}
