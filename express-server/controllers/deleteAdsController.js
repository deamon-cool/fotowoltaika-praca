const fs = require('fs');

const Ad = require('../db/model/Ad');
const AdDescription = require('../db/model/AdDescription');

module.exports = async (req, res) => {
  try {
    const { idKeys } = req.body;

    for (let i = 0; i < idKeys.length; i++) {
      const idKey = idKeys[i];

      const ad = await Ad.findOne({ idKey: idKey });
      if (ad === null) {
        return res.status(404).send({ error: `Nie znaleziono ogłoszenia, idKey: ${idKey}` });
      }

      const adDescription = await AdDescription.findOne({ idKey: idKey });
      if (adDescription === null) {
        return res.status(404).send({ error: `Znaleziono ogłoszenie, ale nie znaleziono opisu, idKey: ${idKey}` });
      }

      if (ad.imageBlobName !== '') {
        // delete file
        try {
          fs.unlinkSync('./uploads/' + ad.imageBlobName);
          //deleted image

          await AdDescription.deleteOne(adDescription);
          await Ad.deleteOne(ad);
        } catch (err) {
          return res.status(500).send({ error: `Nie można usunąć obrazu dla ogłoszenia, idKey: ${idKey}` }); // e.x. bad imageBlobName: '...', not found
        }

      } else {
        await AdDescription.deleteOne(adDescription);
        await Ad.deleteOne(ad);
      }
    }

    return res.status(200).send({ text: 'Ogłoszenie/a usunięto poprawnie.' });
  } catch (e) {
    console.log('Err for: deleteAdsController ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}