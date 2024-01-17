const config = require('../config/config.json');

module.exports = (req, res, next) => {
  try {
    const inputs = req.body.inputs;

    if (inputs === undefined || inputs === null || typeof inputs !== 'object') {
      return res.status(400).send({ error: 'Błąd wysyłania pól. Odśwież stronę.' });
    }

    if (Object.keys(inputs).length !== 12) {
      return res.status(400).send({ error: 'Pominięto/usunięto pola. Odśwież stronę.' });
    }

    for (key in inputs) {
      const inputNameExist = config.INPUTS_NAMES.includes(key);

      if (!inputNameExist) {
        return res.status(400).send({ error: 'Błąd. Nieznana nazwa pola. Odśwież stronę.' });
      }

      if (inputs[key].value === undefined || inputs[key].value === null
        || typeof inputs[key].value !== 'string') {
        return res.status(400).send({ error: 'Błąd. Wartość nieznana w jakimś polu. Odśwież stronę.' });
      }

      if (key === 'contact') {
        // increase level of length for contact area
        if (inputs[key].value.length > 420) {
          return res.status(400).send({ error: 'Błąd. Wyrażenie w polu Kontakt jest za długie. Skontaktuj się administratorem.' });
        }
      } else {
        if (inputs[key].value.length > 70) {
          return res.status(400).send({ error: 'Błąd. Wyrażenie w polu/polach jest za długie.' });
        }
      }

      if (key === 'minSalary' || key === 'maxSalary') {
        // avoid checking value minSalary and maxSalary
      } else {
        if (inputs[key].value === '') {
          return res.status(400).send({ error: 'Wszystkie pola muszą być wypełnione oprócz Opisu i Wynagrodzenia.' });
        }
      }
    }

    next();
  } catch (e) {
    console.log('Err for: checkInputsBody ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}