const PublicInfo = require('../db/model/PublicInfo');

module.exports = async (req, res) => {
  try {
    const text = req.body.text;

    if (typeof text !== 'string' || text === null || text === undefined ||
      text.length > 1000) {
      return res.status(400).send({ error: 'Nieprawidłowe żądanie.' });
    }

    const publicInfo = await PublicInfo.findOne();

    if (publicInfo) {
      await publicInfo.updateOne({ text: text });
    } else {
      return res.status(400).send({ error: 'Nie znaleziono publicznego info w db.' });
    }

    return res.status(200).send({ text: 'Zaktualizowano text' });
  } catch (e) {
    console.log('Err for: changePublicInfoController ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}