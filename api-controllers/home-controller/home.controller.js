var logger = require("log4js").getLogger('home-controller');

/**
 * @api {get} / Request index page
 *
 * @apiSuccess {String} .
 * @apiSuccess {String} .
 */
module.exports.get = function(req, res) {
    res.json({ "home": "Home Controller works!" });
}