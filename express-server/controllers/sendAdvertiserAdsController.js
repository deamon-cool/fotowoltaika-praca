const Ad = require('../db/model/Ad');
const AdvertiserShortSession = require('../db/model/AdvertiserShortSession');

module.exports = async (req, res) => {
  try {
    const { skippedDocs, limitDocs } = req.params;
    const advertiserID = req.headers.advertiserid;

    const skippedDocsNum = parseInt(skippedDocs);
    const limitDocsNum = parseInt(limitDocs);

    const advertiser = await AdvertiserShortSession.findOne({ advertiserID: advertiserID });

    const ads = await Ad.find({ idKey: { $in: advertiser.idKeys } })
      .sort({ date: 'descending' })
      .limit(limitDocsNum).skip(skippedDocsNum);

    let updatedIdKeys = [];
    for (let i = 0; i < ads.length; i++) {
      const ad = ads[i];

      updatedIdKeys.push(ad.idKey);
    }

    await advertiser.updateOne({ idKeys: updatedIdKeys });

    return res.status(200).send({ ads: ads, idKeys: updatedIdKeys });

  } catch (e) {
    console.log('Err for: sendAdvertiserAdsController ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}