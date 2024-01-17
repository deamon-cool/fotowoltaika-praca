module.exports = (req, res, next) => {
    try {
        const { skippedDocs, limitDocs } = req.params;

        if (skippedDocs === '' || isNaN(skippedDocs) === true) {
            return res.status(400).send({ error: 'Nieprawidłowy parametr url. Odśwież stronę.' });
        }

        if (limitDocs === '' || isNaN(limitDocs) === true) {
            return res.status(400).send({ error: 'Nieprawidłowy parametr url. Odśwież stronę.' });
        }

        const skippedDocsNum = parseInt(skippedDocs);
        const limitDocsNum = parseInt(limitDocs);

        if (skippedDocsNum < 0) {
            return res.status(400).send({ error: 'Nieprawidłowy parametr url. Odśwież stronę.' });
        }

        if (limitDocsNum < 0) {
            return res.status(400).send({ error: 'Nieprawidłowy parametr url. Odśwież stronę.' });
        }

        next();
    } catch (e) {
        console.log('Err for: checkSendAdsParams ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}