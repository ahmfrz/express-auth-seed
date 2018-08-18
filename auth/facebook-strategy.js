var passport = require('passport');
var authHelper = require('./auth-helper');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports.configure = function(config) {
    passport.use(new FacebookStrategy({
            clientID: config.FACEBOOK_APP_ID,
            clientSecret: config.FACEBOOK_APP_SECRET,
            callbackURL: config.BASE_URL + "/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            authHelper.updateMembership(accessToken, refreshToken, profile, done);
        }
    ));
}