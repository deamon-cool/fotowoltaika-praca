const Ad = require('../db/model/Ad');

module.exports = async (req, res) => {
  try {
    const { publishParam } = req.params;
    let adsLength = 0;

    if (publishParam === 'publikowane') {
      adsLength = await Ad.countDocuments({ publish: true });
   
      return res.status(200).send({ foundedAdsLength: adsLength });
    }

    if (publishParam === 'niepublikowane') {
      adsLength = await Ad.countDocuments({ publish: false });

      return res.status(200).send({ foundedAdsLength: adsLength });
    }

    if (publishParam === 'wszystkie-ogloszenia') {
      adsLength = await Ad.countDocuments();

      return res.status(200).send({ foundedAdsLength: adsLength });
    }

    return res.status(400).send({ error: 'Błąd. Wartość published nieprawidłowa.' });
  } catch (e) {
    console.log('Err for: sendAdminAdsAmountCotroller ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}