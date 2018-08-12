var logger = require('log4js').getLogger('auth-bearer');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');
var User = require('../models/user.model');

module.exports.configure = function(config) {
    passport.use(new BearerStrategy((token, done) => {
        try {
            const user = jwt.verify(token, config.SECRET);
            User.findOne({ username: user.username }, function(err, userParam) {
                if (err) {
                    logger.error("Error occurred", err);
                    return done(err);
                }

                if (!userParam) {
                    logger.warn("Authentication failed, user not found");
                    return done(null, false);
                }

                return done(null, userParam.username);
            });
        } catch (error) {
            return done(null, false);
        }
    }));
}