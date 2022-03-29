// load all the things we need
import * as passportLocal from 'passport-local';
import passport from 'passport';
import { logger } from '../config/logger';

import User from '../models/user';

const env = process.env.NODE_ENV || 'development';
const LocalStrategy = passportLocal.Strategy;

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

/**
 * User login function using email
 */
passport.use('email-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function (req, email, password, done) {
    User.findOne({ 'email': email },
      function (err, user) {
        if (err) {
          logger.error('Unable to get user from email-login in passport.js. Error: ' + err);
          return done(err.message);
        }

        if (!user) {
          return done(null, false, 'Oops! Invalid username / password.');

        } else {
          user.validatePassword(password)
            .then(result => {
              if (result) {
                return done(null, user);
              } else {
                return done(null, false, 'Oops! Invalid username / password.');
              }
            }).catch(err => {
              if (err) {
                logger.error('Unable to validate password from email-login in passport.js. Error: ' + err);
                return done(err.message);
              }
            });
        }
      });
  }
));

/**
 * @function User signup function using email
 */
passport.use('email-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function (req, email, password, done) {

    process.nextTick(function () {
      User.findOne({ 'email': email },
        function (err, user) {
          if (err) {
            logger.error('Unable to get single user record from email-signup in passport.js. Error: ' + err);
            return done(err.message);
          }

          if (user) {
            // Email or mobile existed. Halt registration.
            return done(null, false, 'Email has been taken');

          } else {

            const newUser = new User();

            newUser.generateHash(password)
              .then(hash => {
                newUser.password = hash;
                newUser.email = email;

                newUser.save(function (err) {
                  if (err) {
                    logger.error('Unable to save new user from email-signup in passport.js. Error: ' + err);
                    return done(err.message);
                  }

                  return done(null, newUser);
                });
              }).catch(err => {
                if (err) {
                  logger.error('Unable to get generate hash from bcrypt in passport.js. Error: ' + err);
                  return done(err.message);
                }
              });
          }
        });
    });
  }));

export default passport;
