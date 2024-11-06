const Ad = require('../db/model/Ad');

module.exports = async (req, res) => {
  try {
    const { positionMarker, voivodeship, skippedDocs, limitDocs } = req.params;

    const skippedDocsNum = parseInt(skippedDocs);
    const limitDocsNum = parseInt(limitDocs);

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

    const ads = await Ad.find(querySearch).sort({ date: 'descending' }).limit(limitDocsNum).skip(skippedDocsNum);

    return res.status(200).send({ ads: ads });
  } catch (e) {
    console.log('Err for: sendAdsController ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}