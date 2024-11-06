const Ad = require('../db/model/Ad');

module.exports = async (req, res) => {
    try {
        const { idKey, publish } = req.body;
        const ad = await Ad.findOne({ idKey: idKey });

        let publicationDate = '-';
        if (publish) {
            const newDate = new Date();
            let day = newDate.getDate().toString();
            let month = (newDate.getMonth() + 1).toString();
            const year = newDate.getFullYear().toString();

            day = day.length < 2 ? '0' + day : day;
            month = month.length < 2 ? '0' + month : month;

            publicationDate = day + '/' + month + '/' + year;
        }

        if (ad) {
            const date = Date.now();

            await ad.updateOne({
                date: date,
                publish: publish,
                views: 0,
                publicationDate: publicationDate
            });

            return res.status(200).send({ text: 'Zmieniono stan publikowania', date: date, publish: publish });
        }

        return res.status(404).send({ error: 'Nie znaleziono ogłoszenia' });
    } catch (e) {
        console.log('Err for: updatePublishWithDateController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}