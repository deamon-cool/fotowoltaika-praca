const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

module.exports = async (req, res) => {
    try {
        // dates
        const timeTodayMiliseconds = new Date().getTime();
        const tokenTime = 1000 * 60 * config.TOKEN_EXPIRATION_MINUTES;
        const expirationTime = timeTodayMiliseconds + tokenTime;

        // token
        const token = jwt.sign({
            exp: expirationTime
        }, config.TOKEN_SECRET);

        // cookie
        let cookieConfig = {
            httpOnly: true,
            secure: config.SECURE_COOKIE,
            signed: true
        };

        if (config.SAMESITE_COOKIE) {
            cookieConfig.sameSite = 'strict';
        }

        res.cookie(config.COOKIE_NAME, token, cookieConfig);

        return res.status(200).send({ correct: true, tokenTime: tokenTime });
    } catch (e) {
        console.log('Err for: loginController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}