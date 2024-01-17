const config = require('../config/config.json');
const AdDdosBlackIp = require('../db/model/AdDdosBlackIp');

module.exports = async (req, res, next) => {
  try {
    if (typeof req.header('x-forwarded-for') !== 'string') {
      return res.status(400).send({
        error: 'Błąd. Nie można zidentyfikować ip.',
        showReCaptcha: true
      });
    }

    const adDdosBlackIp = await AdDdosBlackIp.findOne({ ip: req.header('x-forwarded-for') });

    if (adDdosBlackIp) {
      const oldTries = adDdosBlackIp.tries;
      const newTries = oldTries + 1;

      // checking if somebody didn't cross a limit of sending ads
      if (newTries > config.BAN_IP_AFTER_AD_DDOS_MAX_TRIES) {
        console.log(`(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
          `${(new Date().getHours())}:${(new Date().getMinutes())}) ` +
          `${req.header('x-forwarded-for')} sent too much ads and has been blocked.`
        );

        return res.status(401).send({
          error: 'Wysłałeś za dużo ogłoszeń. Zgłoś się do administratora serwisu.',
          correct: false
        });
      } else {
        await adDdosBlackIp.updateOne({
          tries: newTries,
          lastTryDate: Date.now()
        });
      }
    } else {
      await AdDdosBlackIp.create({
        ip: req.header('x-forwarded-for'),
        tries: 1,
        lastTryDate: Date.now()
      });
    }

    next();
  } catch (e) {
    console.log('Err for: adDdosBlackIps ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}