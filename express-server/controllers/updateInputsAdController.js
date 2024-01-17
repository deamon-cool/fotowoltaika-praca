const Ad = require('../db/model/Ad');

module.exports = async (req, res) => {
    try {
        const { idKey, inputs } = req.body;
        const ad = await Ad.findOne({ idKey: idKey });

        if (ad) {
            await ad.updateOne({
                inputs: inputs
            });

            return res.status(200).send({ text: 'Zaktualizowano pola' });
        }

        return res.status(404).send({ error: 'Nie znaleziono ogłoszenia' });
    } catch (e) {
        console.log('Err for: updateInputsAdController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}