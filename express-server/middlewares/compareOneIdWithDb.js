const AdvertiserShortSession = require('../db/model/AdvertiserShortSession');

module.exports = async (req, res, next) => {
  try {
    const { idKey } = req.body;
    const advertiserID = req.headers.advertiserid;

    const advertiser = await AdvertiserShortSession.findOne({ advertiserID: advertiserID });

    // checking if sent idKey is in database for specified advertiserID
    let idKeyIsInDb = false;
    for (const key in advertiser.idKeys) {
      if (idKey === advertiser.idKeys[key]) {
        idKeyIsInDb = true;

        break;
      }
    }

    if (!idKeyIsInDb) {
      console.log(`(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
        `${(new Date().getHours())}:${(new Date().getMinutes())}) ` +
        `${req.header('x-forwarded-for')} failed with editing idKey: ${idKey}.`
      );

      return res.status(401).send({
        error: 'Nie jesteś autoryzowany, żeby edytować to ogłoszenia. Zamknij stronę i uruchom ponownie.'
      });
    }

    next();
  } catch (e) {
    console.log('Err for: compareOneIdWithDb ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}