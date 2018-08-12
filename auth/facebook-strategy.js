var logger = require('log4js').getLogger('auth-facebook');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var Membership = require('../models/membership.model');

module.exports.configure = function(config) {
    passport.use(new FacebookStrategy({
            clientID: config.FACEBOOK_APP_ID,
            clientSecret: config.FACEBOOK_APP_SECRET,
            callbackURL: config.BASE_URL + "/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            Membership.findOne({ providerUserId: profile.id }, function(err, membership) {
                if (err) {
                    logger.error("Could not find membership", err);
                    return done(err);
                }

                if (!membership) {
                    var user = new User({
                        username: profile.id,
                        displayname: profile.displayName,
                    });


                    user.save(function(err) {
                        if (err) {
                            return done(err);
                        }
                        membership = new Membership({
                            provider: profile.provider,
                            providerUserId: profile.id,
                            accessToken: accessToken,
                            userId: user
                        });

                        membership.save(function(err) {
                            if (err) { return done(err); }
                            return done(null, jwt.sign({ username: user.username }, config.SECRET, {
                                // expiresIn: '24h', // expires in 24 hours
                            }));
                        });
                    });
                } else {
                    User.findById(membership.userId, function(err, user) {
                        if (err) { return done(err); }
                        var token = jwt.sign({ username: user.username }, config.SECRET, {
                            // expiresIn: '24h', // expires in 24 hours
                        });

                        return done(null, token);
                    });
                }
            });
        }
    ));
}