const mongoose = require('mongoose');

const LoginBlackIpSchema = mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    tries: {
        type: Number,
        required: true
    },
    lastTryDate: {
        type: Date,
    }
});

const LoginBlackIp = mongoose.model('LoginBlackIps', LoginBlackIpSchema);

module.exports = LoginBlackIp;