const jwt = require('jsonwebtoken');

const config = require('../config/config.json');

module.exports = async (req, res, next) => {
    try {
        // get token from cookie
        const tokenFromCookie = req.signedCookies[config.COOKIE_NAME];

        // check cookie changes
        if (tokenFromCookie === undefined || tokenFromCookie === false) {
            return res.status(401).send({ error: 'Nieautoryzowany. Problem z cookies' });
        }

        // decode token
        const decoded = jwt.verify(tokenFromCookie, config.TOKEN_SECRET);

        // check token expire
        const timeTodayMiliseconds = new Date().getTime();
        if (decoded.exp < timeTodayMiliseconds) {
            return res.status(401).send({ error: 'Nieautoryzowany. Token wygasł' });
        }

        next();
    } catch (e) {
        console.log('Err for: authCheck ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}