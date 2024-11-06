const mongoose = require('mongoose');

module.exports = (path) => {
    mongoose.connect(path, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'error connection to Db'));
    db.once('open', () => {
        console.log('connected to Db');
    });
}