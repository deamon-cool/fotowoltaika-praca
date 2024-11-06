const Ad = require('../db/model/Ad');

module.exports = async (req, res) => {
    try {
        const { idKey } = req.params;

        const ad = await Ad.findOne({ idKey: idKey });

        return res.status(200).send({ ad: ad });
    } catch (e) {
        console.log('Err for: sendAdController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}