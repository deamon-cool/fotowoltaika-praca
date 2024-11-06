const fetch = require('node-fetch');

const AdDdosBlackIp = require('../db/model/AdDdosBlackIp');
const config = require('../config/config.json');

module.exports = async (req, res, next) => {
  try {
    if (typeof req.header('x-forwarded-for') !== 'string') {
      return res.status(400).send({
        error: 'Błąd. Nie można zidentyfikować ip.',
        showReCaptcha: true
      });
    }

    const adDdosBlackIp = await AdDdosBlackIp.findOne({ ip: req.header('x-forwarded-for') });
    let tries = 0;

    if (adDdosBlackIp) {
      tries = adDdosBlackIp.tries;
    }

    // check if tries is even (if not then change)
    if (tries % 2 !== 0) {
      tries = tries + 1;
    }

    // every 'same' times check recaptcha
    if (tries % config.RECAPTCHA_CHECK_AFTER_TIMES === 0) {
      const recaptchaToken = req.body.recaptchaToken;

      if (recaptchaToken === '') {
        return res.status(401).send({
          error: 'Zaznacz "Nie jestem robotem" i wyślij ogłoszenie ponownie.',
          showReCaptcha: true
        });
      }

      if (recaptchaToken === undefined || recaptchaToken === null
        || typeof recaptchaToken !== 'string') {
        return res.status(401).send({
          error: 'Zaznacz "Nie jestem robotem" i wyślij ogłoszenie ponownie.',
          showReCaptcha: true
        });
      }

      const url = config.RECAPTCHA_VERIFY_API_REQUEST + '?secret=' + config.RECAPTCHA_KEY_SERVER_SITE +
        '&response=' + recaptchaToken;

      const init = {
        method: 'POST',
        headers: { "Content-Type": "application/json" }
      };

      const resApi = await fetch(url, init).then(res => res.json());

      if (resApi.success) {
        next();
      } else {
        return res.status(401).send({
          error: 'Zaznacz "Nie jestem robotem" i wyślij ogłoszenie ponownie.',
          showReCaptcha: true
        });
      }

    } else {
      next();
    }
  } catch (e) {
    console.log('Err for: checkRecaptcha ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}