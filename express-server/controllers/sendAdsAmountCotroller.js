const Ad = require('../db/model/Ad');

module.exports = async (req, res) => {
  try {
    const { positionMarker, voivodeship } = req.params;

    let querySearch = {
      'inputs.positionMarker.value': positionMarker,
      'inputs.voivodeship.value': voivodeship,
      publish: true
    };

    if (positionMarker === 'wszystkie' && voivodeship !== 'wszystkie') {
      querySearch = {
        'inputs.voivodeship.value': voivodeship,
        publish: true
      };
    }

    if (voivodeship === 'wszystkie' && positionMarker !== 'wszystkie') {
      querySearch = {
        'inputs.positionMarker.value': positionMarker,
        publish: true
      };
    }

    if (positionMarker === 'wszystkie' && voivodeship === 'wszystkie') {
      querySearch = { publish: true };
    }

    const adsLength = await Ad.countDocuments(querySearch);

    return res.status(200).send({ foundedAdsLength: adsLength });
  } catch (e) {
    console.log('Err for: sendAdsAmountCotroller ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}