var logger = require('log4js').getLogger('auth-oauth2');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var User = require('../models/user.model');

module.exports.configure = function(config) {
    passport.use('provider', new OAuth2Strategy({
            authorizationURL: 'https://www.provider.com/oauth2/authorize',
            tokenURL: 'https://www.provider.com/oauth2/token',
            clientID: '123-456-789',
            clientSecret: 'shhh-its-a-secret',
            callbackURL: 'https://www.example.com/auth/provider/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOrCreate('', function(err, user) {
                done(err, user);
            });
        }
    ));
}