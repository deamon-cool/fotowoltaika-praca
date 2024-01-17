const AdDescription = require('../db/model/AdDescription');
const Ad = require('../db/model/Ad');
const config = require('../config/config.json');

module.exports = async (req, res) => {
  try {
    const { idKey } = req.params;
    const ip = req.header('x-forwarded-for');

    const adDescription = await AdDescription.findOne({ idKey: idKey });

    if (adDescription) {
      // upadate views
      if (ip !== config.MY_IP) {
        const ad = await Ad.findOne({ idKey: idKey });
        if (ad) {
          const views = typeof ad.views === 'number' ? ad.views : 0;
          await ad.updateOne({
            views: views + 1
          });
        }
      }

      return res.status(200).send({ editorContent: adDescription.editorContent });
    }

    return res.status(404).send({ text: 'Nie znaleziono żądanego opisu' });
  } catch (e) {
    console.log('Err for: sendDescriptionController ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}