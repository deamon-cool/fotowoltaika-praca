const Ad = require('../db/model/Ad');

module.exports = async (req, res) => {
    try {
        const { publishParam, skippedDocs, limitDocs } = req.params;

        const skippedDocsNum = parseInt(skippedDocs);
        const limitDocsNum = parseInt(limitDocs);
        let querySearch = {};

        if (publishParam === 'publikowane') {
            querySearch = { publish: true };
        }

        if (publishParam === 'niepublikowane') {
            querySearch = { publish: false };
        }

        if (publishParam === 'wszystkie-ogloszenia') {
            querySearch = {};
        }

        const ads = await Ad.find(querySearch).sort({ date: 'descending' }).limit(limitDocsNum).skip(skippedDocsNum);

        return res.status(200).send({ allAds: ads });
    } catch (e) {
        console.log('Err for: sendAdminAdsController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}