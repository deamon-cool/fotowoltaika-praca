const bcrypt = require('bcrypt');

const config = require('../config/config.json');
const LoginBlackIp = require('../db/model/LoginBlackIp');

module.exports = async (req, res, next) => {
    try {
        if (typeof req.body.u !== 'string' || typeof req.body.p !== 'string') {
            return res.status(400).send({ error: 'Error body object', correct: false });
        }

        const userCorrect = await bcrypt.compare(req.body.u, config.MAIN_USER);
        const passwordCorrect = await bcrypt.compare(req.body.p, config.PASSWORD_MAIN_USER);

        if (!userCorrect || !passwordCorrect) {
            return res.status(401).send({ error: 'Wrong user or password', correct: false });
        }

        // delete previous added black ip
        await LoginBlackIp.deleteOne({ ip: req.header('x-forwarded-for') });

        next();
    } catch (e) {
        console.log('Err for: loginVerification ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}