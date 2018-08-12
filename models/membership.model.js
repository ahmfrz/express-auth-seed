var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Membership', new Schema({
    provider: String,
    providerUserId: String,
    accessToken: String,
    userId: { type: Schema.ObjectId, ref: 'User', required: true },
    dateAdded: { type: Date, default: Date.now }
}));