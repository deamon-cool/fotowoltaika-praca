const bcrypt = require('bcrypt');

const AdvertiserShortSession = require('../db/model/AdvertiserShortSession');
const LoginBlackIp = require('../db/model/LoginBlackIp');

module.exports = async (req, res, next) => {
  try {
    const advertiserID = req.headers.advertiserid;
    const entryKey = req.headers.entrykey;

    if (typeof advertiserID !== 'string' || typeof entryKey !== 'string') {
      console.log(`(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
        `${(new Date().getHours())}:${(new Date().getMinutes())}) ` +
        `${req.header('x-forwarded-for')} failed to login as advertiser. Improper ID or entryKey.`
      );

      return res.status(400).send({ error: 'Nieprawidłowy ID lub klucz wejściowy. Odśwież stronę.' });
    }

    const advertiser = await AdvertiserShortSession.findOne({ advertiserID: advertiserID });
    if (advertiser === null) {
      console.log(`(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
        `${(new Date().getHours())}:${(new Date().getMinutes())}) ` +
        `${req.header('x-forwarded-for')} failed with advertiserID as advertiser.`
      );

      return res.status(401).send({
        error: 'Błąd ID. Brak autoryzacji do dodanych ogłoszeń. Zamknij stronę i uruchom ponownie.'
      });
    }

    const passwordCorrect = await bcrypt.compare(entryKey, advertiser.entryKeyHash);
    if (!passwordCorrect) {
      console.log(`(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
        `${(new Date().getHours())}:${(new Date().getMinutes())}) ` +
        `${req.header('x-forwarded-for')} failed with entryKey as advertiser.`
      );

      return res.status(401).send({
        error: 'Błąd autoryzacji. Brak autoryzacji do dodanych ogłoszeń. Zamknij stronę i uruchom ponownie.'
      });
    }

    // delete previous added black ip
    await LoginBlackIp.deleteOne({ ip: req.header('x-forwarded-for') });

    next();
  } catch (e) {
    console.log('Err for: advertiserLoginCheck ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}