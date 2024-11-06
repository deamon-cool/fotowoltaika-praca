const config = require('../config/config.json');

module.exports = async (req, res) => {
    try {
        res.clearCookie(config.COOKIE_NAME)

        return res.status(200).send({ logout: true });
    } catch (e) {
        console.log('Err for: loginOutController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}