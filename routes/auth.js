var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/api/test',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        res.json(req.user);
    });

router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    function(req, res) {
        res.json({
            token: req
        });
    }
);

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
router.get('/provider', passport.authenticate('provider', { scope: 'email' }));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get('/provider/callback',
    passport.authenticate('provider', {
        successRedirect: '/',
        failureRedirect: '/login',
    }));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
router.get('/facebook', passport.authenticate('facebook', { session: false }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/auth/setup/',
        session: false,
    })
);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile'],
        session: false,
    }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback',
    passport.authenticate('google', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/auth/setup/',
        session: false,
    }));

module.exports = router;