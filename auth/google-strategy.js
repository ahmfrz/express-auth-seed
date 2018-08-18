var passport = require('passport');
var authHelper = require('./auth-helper');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports.configure = function(config) {
    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passport.use(new GoogleStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.BASE_URL + "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            authHelper.updateMembership(accessToken, refreshToken, profile, done);
        }
    ));
}