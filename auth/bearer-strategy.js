var logger = require('log4js').getLogger('auth-bearer');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var helper = require('./auth-helper');
var User = require('../models/user.model');

module.exports.configure = function(config) {
    passport.use(new BearerStrategy((token, done) => {
        try {
            const user = helper.verifyToken(token, config.SECRET);
            User.findOne({ username: user.username }, function(err, userParam) {
                if (err) {
                    throw err;
                }

                if (!userParam) {
                    logger.warn("Authentication failed, user not found");
                    return done(null, false);
                }

                return done(null, true);
            });
        } catch (error) {
            logger.error("Exception occurred in bearer strategy", err);
            return done(err);
        }
    }));
}