const fs = require('fs');

const Ad = require('../db/model/Ad');
const AdDescription = require('../db/model/AdDescription');
const AdvertiserShortSession = require('../db/model/AdvertiserShortSession');

module.exports = async (req, res) => {
  try {
    const { idKeys } = req.body;
    const advertiserID = req.headers.advertiserid;

    for (let i = 0; i < idKeys.length; i++) {
      const idKey = idKeys[i];

      // searching ad in db
      const ad = await Ad.findOne({ idKey: idKey });
      if (ad === null) {
        return res.status(404).send({
          error: `Błąd. Nie można usunąć ogłoszenia, ponieważ go nie znaleziono, idKey: ${idKey}. Możesz zgłosić problem do administratora.`
        });
      }

      const adDescription = await AdDescription.findOne({ idKey: idKey });
      if (adDescription === null) {
        return res.status(404).send({
          error: `Błąd. Nie można usunąć ogłoszenia, ponieważ nie znaleziono opisu, idKey: ${idKey}. Możesz zgłosić problem do administratora.`
        });
      }

      // try to delete ad with image
      if (ad.imageBlobName !== '') {
        try {
          fs.unlinkSync('./uploads/' + ad.imageBlobName); // deleting image

          await AdDescription.deleteOne(adDescription);
          await Ad.deleteOne(ad);
        } catch (err) {
          return res.status(500).send({
            error: `Błąd. Nie można usunąć ogłoszenia, ponieważ nie znaleziono obrazu loga ogłoszenia, idKey: ${idKey}. Możesz zgłosić problem do administratora.`
          }); // e.x. bad imageBlobName: '...', not found
        }
      } else {
        await AdDescription.deleteOne(adDescription);
        await Ad.deleteOne(ad);
      }

      //delete idKey from advertiser
      await AdvertiserShortSession.updateOne({ advertiserID: advertiserID }, { $pull: { idKeys: { $in: [idKey] } } });
    }

    const advertiser = await AdvertiserShortSession.findOne({ advertiserID: advertiserID });

    return res.status(200).send({ text: 'Ogłoszenie/a usunięto poprawnie.', idKeys: advertiser.idKeys });
  } catch (e) {
    console.log('Err for: deleteAdvertiserAdsController ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}