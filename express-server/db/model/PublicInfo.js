const mongoose = require('mongoose');

const PublicInfoSchema = mongoose.Schema({
    text: {
        type: String
    }
});

const PublicInfo = mongoose.model('PublicInfos', PublicInfoSchema);

module.exports = PublicInfo;