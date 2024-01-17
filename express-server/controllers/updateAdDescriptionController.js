const AdDescription = require('../db/model/AdDescription');

module.exports = async (req, res) => {
    try {
        const { idKey, editorContent } = req.body;
        const adDescription = await AdDescription.findOne({ idKey: idKey });

        if (adDescription) {
            await adDescription.updateOne({
                editorContent: editorContent
            });

            return res.status(200).send({ text: 'Zaktualizowano opis' });
        }

        return res.status(404).send({ error: 'Nie znaleziono opisu' });
    } catch (e) {
        console.log('Err for: updateAdDescriptionController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}