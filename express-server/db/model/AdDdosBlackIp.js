const mongoose = require('mongoose');

const AdDdosBlackIpSchema = mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    tries: {
        type: Number,
        required: true
    },
    lastTryDate: {
        type: Date
    }
});

const AdDdosBlackIp = mongoose.model('AdDdosBlackIps', AdDdosBlackIpSchema);

module.exports = AdDdosBlackIp;