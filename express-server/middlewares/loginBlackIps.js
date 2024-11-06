const config = require('../config/config.json');
const LoginBlackIp = require('../db/model/LoginBlackIp');

module.exports = async (req, res, next) => {
  try {
    if (typeof req.header('x-forwarded-for') !== 'string') {
      return res.status(400).send({
        error: 'Błąd. Nie można zidentyfikować ip.',
        correct: false
      });
    }

    const loginBlackIp = await LoginBlackIp.findOne({ ip: req.header('x-forwarded-for') });

    if (loginBlackIp) {
      const oldTries = loginBlackIp.tries;
      const newTries = oldTries + 1;

      if (newTries > config.BAN_IP_AFTER_LOGIN_MAX_TRIES) {
        console.log(`(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
          `${(new Date().getHours())}:${(new Date().getMinutes())}) ` +
          `${req.header('x-forwarded-for')} has been banned.`
        );

        return res.status(401).send({
          error: 'Zostałeś zablokowany. Skontaktuj się z administratorem.',
          correct: false
        });
      }

      await loginBlackIp.updateOne({
        tries: newTries,
        lastTryDate: Date.now()
      });
    } else {
      await LoginBlackIp.create({
        ip: req.header('x-forwarded-for'),
        tries: 1,
        lastTryDate: Date.now()
      });
    }

    next();
  } catch (e) {
    console.log('Err for: loginBlackIps ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}