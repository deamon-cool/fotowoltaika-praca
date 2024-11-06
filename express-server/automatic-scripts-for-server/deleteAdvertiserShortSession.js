console.log('deleteAdvertiserShortSession.js is executing...')

const mongoose = require('mongoose');
const config = require('../config/config.json');

// production or test enviroment
let mongoDbPath = 'mongodb://localhost/fotowoltaika-db';
if (config.PRODUCTION_MODE) {
	mongoDbPath = `mongodb://${config.USER_DB}:${config.PASS_DB}@localhost/fotowoltaika-db?authSource=admin`;
}

const collectionName = 'advertisershortsessions';

mongoose.connect(mongoDbPath, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'deleteAdvertiserShortSession.js: error connection to Db'));
db.once('open', () => {
	console.log('deleteAdvertiserShortSession.js: connected to Db and dropping ' + collectionName + '...');

	db.dropCollection(collectionName, (err) => {
		if (err) {
			console.log('deleteAdvertiserShortSession.js: ERROR ------------->\n' + err);
		} else {
			console.log('deleteAdvertiserShortSession.js: dropped collection ' + collectionName);
		}

		db.close();
	});
});
