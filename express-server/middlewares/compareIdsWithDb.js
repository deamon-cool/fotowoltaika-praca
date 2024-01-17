const AdvertiserShortSession = require('../db/model/AdvertiserShortSession');

module.exports = async (req, res, next) => {
  try {
    const { idKeys } = req.body;
    const advertiserID = req.headers.advertiserid;

    const advertiser = await AdvertiserShortSession.findOne({ advertiserID: advertiserID });

    // checking if sent idKeys are in database for specified advertiserID
    for (let i = 0; i < idKeys.length; i++) {

      let idKeyIsInDb = false;
      for (const key in advertiser.idKeys) {
        if (idKeys[i] === advertiser.idKeys[key]) {
          idKeyIsInDb = true;

          break;
        }
      }

      if (!idKeyIsInDb) {
        console.log(`(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
          `${(new Date().getHours())}:${(new Date().getMinutes())}) ` +
          `${req.header('x-forwarded-for')} failed with deleting idKey: ${idKeys[i]}.`
        );

        return res.status(401).send({
          error: 'Nie jesteś autoryzowany, żeby usunąć te ogłoszenia. Zamknij stronę i uruchom ponownie.'
        });
      }
    }

    next();
  } catch (e) {
    console.log('Err for: compareIdsWithDb ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}