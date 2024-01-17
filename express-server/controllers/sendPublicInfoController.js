const PublicInfo = require('../db/model/PublicInfo');

module.exports = async (req, res) => {
  try {
    let publicInfo = await PublicInfo.findOne();

    if (publicInfo === null) {
      publicInfo = await PublicInfo.create({ text: '' });
    }

    return res.status(200).send({ publicInfo: publicInfo.text });
  } catch (e) {
    console.log('Err for: sendPublicInfoController ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}