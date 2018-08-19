var logger = require('log4js').getLogger('auth-google');
var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var Membership = require('../models/membership.model');

var token = {
    createToken: function(username, secret, expiresIn) {
        return jwt.sign({ username: username }, secret, {
            expiresIn: expiresIn
        });
    },
    verifyToken: function(token, secret) {
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            logger.error("Token verification failed", token);
            throw err;
        }
    }
}

module.exports.updateMembership = function(accessToken, refreshToken, profile, done, config) {
    try {
        Membership.findOne({ providerUserId: profile.id }, (err, membership) => {
            if (err) {
                logger.error("Could not find membership for ", profile.id, "error ", err);
                throw err;
            }

            if (!membership) {
                var user = new User({
                    username: profile.id,
                    displayname: profile.displayName,
                });

                user.save(function(err) {
                    if (err) {
                        logger.error("Error creating a new user for ", profile.id, "error ", err);
                        throw err;
                    }

                    membership = new Membership({
                        provider: profile.provider,
                        providerUserId: profile.id,
                        accessToken: accessToken,
                        userId: user
                    });

                    membership.save(function(err) {
                        if (err) {
                            logger.error("Error creating a new membership for ", profile.id, "error ", err);
                            throw err;
                        }

                        return done(null, token.createToken(username, config.SECRET, '24h'));
                    });
                });
            } else {
                User.findById(membership.userId, function(err, user) {
                    if (err) {
                        logger.error("Error finding user ", membership.userId, "error ", err);
                        throw err;
                    }

                    token.createToken(username, config.SECRET, '24h');

                    return done(null, token);
                });
            }
        });
    } catch (err) {
        logger.error("Exception occurred", err);
        return done(err);
    }
}

module.exports.createToken = token.createToken;
module.exports.verifyToken = token.verifyToken;