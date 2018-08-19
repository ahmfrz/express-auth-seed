var logger = require('log4js').getLogger('auth-local');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var helper = require('./auth-helper');
var User = require('../models/user.model');

module.exports.configure = function(config) {
    passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
        try {
            User.findOne({ username: username }, function(err, user) {
                if (err) {
                    logger.error("Error occurred for user", username, err);
                    throw err;
                }

                if (!user) {
                    logger.warn("User not found", username);
                    return done(null, false);
                }

                if (!user.validPassword(password)) {
                    logger.warn("Incorrect password for user", username);
                    return done(null, false);
                }

                logger.debug("Login successful for user", username);

                req.token = helper.createToken(username, config.SECRET, '24h');
                return done(null, true);
            });
        } catch (err) {
            logger.error("Exception occurred in local strategy", err);
            return done(err);
        }
    }));
}