const mongoose = require('mongoose');

const AdSchema = mongoose.Schema({
    idKey: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    inputs: {
        type: Object,
        required: true
    },
    imageBlobName: {
        type: String
    },
    publish: {
        type: Boolean,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    publicationDate: {
        type: String,
    }
});

const Ad = mongoose.model('Ads', AdSchema);

module.exports = Ad;