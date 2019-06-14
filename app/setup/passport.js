const localStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = passport => {

  //local Strategy
  passport.use(new localStrategy((username, password, done) => {

    User.findOne({username: username}, (err, user) => {
      if (err) {
        throw err
      }
      if (!user) {
        return done(null, false, {message: 'no user found'})
      }

      //match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          throw err
        }

        if (isMatch) {
          return done(null, user, {message: 'You are logged in'})
        } else {
          return done(null, false, {message: 'wrong password'})
        }
      })
    })
  }))

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
