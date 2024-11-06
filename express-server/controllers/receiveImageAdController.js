const multer = require('multer');
const fs = require('fs');

const Ad = require('../db/model/Ad');
const config = require('../config/config.json');
const badNameErr = 'Nieprawidłowa nazwa obrazu.';
const badMimeErr = 'Nieprawidłowy typ obrazu. Typ obrazu musi być .png/.jpg/.jpeg .';

// INFO if you change path ./uploads/ search if nowhere is the same path used

// multer configuration
const storage = multer.diskStorage({
	destination: './uploads/',
	filename: function (req, file, cb) {
		// console.log(3);
		const fileName = file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1];
		req.fileName = fileName;

		cb(null, fileName);
	}
})

const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 },
	fileFilter: function (req, file, cb) {
		// console.log(2);
		// check if file is image
		const name = file.originalname;
		const mime = file.mimetype;

		if (name !== 'blob') {
			cb(badNameErr);
		}

		if (mime !== 'image/jpeg' && mime !== 'image/png') {
			cb(badMimeErr);
		}

		cb(null, true);
	}
}).single(config.MULTER_IMAGE_NAME);

// delete file
function deleteFile(fileName) {
	fs.unlink('./uploads/' + fileName, (err) => {
		if (err) {
			console.log('ERROR deleting file: ' + fileName);
		}
	});
}

module.exports = (req, res) => {
	try {
		// console.log(1);
		const { idKey } = req.params;

		upload(req, res, async (err) => {
			// console.log(4);
			if (err) {
				deleteFile(req.fileName);

				if (err === badNameErr || err === badMimeErr) {
					return res.status(400).send({ error: err });
				}

				return res.status(400).send({ error: 'Błąd zapisu obrazu.' });
			} else {
				if (req.file === undefined) {
					return res.status(400).send({ error: 'Nie wybrano obrazu.' });
				} else {			
					const adItem = await Ad.findOne({ idKey: idKey });
					if (adItem === null) {
						deleteFile(req.fileName)

						return res.status(400).send({ error: 'Obraz usunięty. Nie znaleziono ogłoszenia.' });
					}

					await Ad.updateOne(adItem, {
						imageBlobName: req.fileName
					});

					return res.status(200).send({ text: 'Ogłoszenie i obraz zapisane.' });
				}
			}
		});
	} catch (e) {
		console.log('Err for: receiveImageAdController ------------->\n' + e);

		return res.status(500).send({
			error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
		});
	}
}