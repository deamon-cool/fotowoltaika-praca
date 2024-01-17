const mongoose = require('mongoose');

const AdvertiserShortSessionSchema = mongoose.Schema({
    advertiserID: {
        type: String,
        required: true
    },
    entryKeyHash: {
        type: String,
        required: true
    },
    idKeys: {
        type: Array
    }
});

const AdvertiserShortSession = mongoose.model('AdvertiserShortSession', AdvertiserShortSessionSchema);

module.exports = AdvertiserShortSession;