module.exports = (req, res, next) => {
  try {
    const { idKeys } = req.body;

    if (typeof idKeys !== 'object' || !Array.isArray(idKeys)) {
      return res.status(400).send({ error: `Nieprawidłowe żądanie. Odśwież stronę.` });
    }

    if (idKeys.length < 1) {
      return res.status(400).send({ error: 'Przed usunięciem musisz zaznaczyć ogłoszenie/a.' });
    }

    for (let i = 0; i < idKeys.length; i++) {
      const idKey = idKeys[i];

      if (idKey === undefined || idKey === null || typeof idKey !== 'string' || idKey === '') {
        return res.status(400).send({ error: `Ogłoszenie: ${idKey} nieprawidłowe.` });
      }
    }

    next();
  } catch (e) {
    console.log('Err for: checkIdArrayBody ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}