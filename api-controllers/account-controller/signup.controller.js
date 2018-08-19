var logger = require('log4js').getLogger('home-controller');
var User = require('../../models/user.model');

/**
 * @api {post} / Sign up
 *
 * @apiSuccess {String} .
 * @apiSuccess {String} .
 */
module.exports.post = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password) {
        res.status(400);
        return res.json({ message: 'Username and password required' });
    }

    logger.debug("Signup request received for", username);

    try {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                logger.error("Error occurred during signup for", username, err);
                throw err;
            }

            if (user) {
                logger.debug("User already exists", username);
                res.status(403);
                return res.json({ message: "User already exists" });
            }

            user = new User();
            user.username = username;
            user.password = user.generateHash(password);

            user.save((err) => {
                if (err) {
                    logger.error("Error occurred while saving user", username);
                    throw err;
                }

                return res.json({ message: "Signup successful!" });
            });
        });
    } catch (err) {
        logger.error("Error occurred", err);
        res.status(500);
        return res.json({ message: "Something went wrong!" });
    }
}