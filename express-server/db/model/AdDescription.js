const mongoose = require('mongoose');

const AdDescriptionSchema = mongoose.Schema({
    idKey: {
        type: String,
        required: true
    },
    editorContent: {
        type: Object,
        required: true
    },
}, { minimize: false });

const AdDescription = mongoose.model('AdDescriptions', AdDescriptionSchema);

module.exports = AdDescription;