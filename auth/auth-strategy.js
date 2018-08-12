var logger = require('log4js').getLogger('auth');
var facebookStrategy = require('./facebook-strategy');
var googleStrategy = require('./google-strategy');
var localStrategy = require('./local-strategy');
var bearerStrategy = require('./bearer-strategy');
var oauth2Strategy = require('./oauth2-strategy');

module.exports.configure = function(config) {
    localStrategy.configure(config);

    bearerStrategy.configure(config);

    facebookStrategy.configure(config);

    googleStrategy.configure(config);

    oauth2Strategy.configure(config);
}