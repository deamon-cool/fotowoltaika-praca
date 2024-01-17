console.log('deleteAdDdosBlackIps.js is executing...')

const mongoose = require('mongoose');
const config = require('../config/config.json');

// production or test enviroment
let mongoDbPath = 'mongodb://localhost/fotowoltaika-db';
if (config.PRODUCTION_MODE) {
	mongoDbPath = `mongodb://${config.USER_DB}:${config.PASS_DB}@localhost/fotowoltaika-db?authSource=admin`;
}

const collectionName = 'adddosblackips';

mongoose.connect(mongoDbPath, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'deleteAdDdosBlackIps.js: ERROR connection to Db'));
db.once('open', () => {
	console.log('deleteAdDdosBlackIps.js: connected to Db and dropping ' + collectionName + '...');

	db.dropCollection(collectionName, (err) => {
		if (err) {
			console.log('deleteAdDdosBlackIps.js: ERROR ------------->\n' + err);
		} else {
			console.log('deleteAdDdosBlackIps.js: dropped collection ' + collectionName);
		}

		db.close();
	});
});
