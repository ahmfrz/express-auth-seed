var logger = require('log4js').getLogger('auth-local');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var User = require('../models/user.model');

module.exports.configure = function(config) {
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                logger.error("Error occurred for user", username, err);
                return done(err);
            }

            if (!user) {
                logger.warn("User not found", username);
                return done(null, false);
            }

            if (!user.validPassword(password)) {
                logger.warn("Incorrect password for user", username);
                return done(null, false);
            }

            logger.warn("Login successful for user", username);
            return done(null, jwt.sign({ username: user.username }, config.SECRET, {
                expiresIn: '24h', // expires in 24 hours
            }));
        });
    }));
}