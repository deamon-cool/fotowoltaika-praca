const Ad = require('../db/model/Ad');

module.exports = async (req, res) => {
	try {
		const { publishQuery, companyNameQuery } = req.query;

		if (typeof publishQuery !== 'string') {
			return res.status(400).send({ error: 'Zapytanie publishQuery jest nieprawidłowy. Odśwież stronę.' });
		}

		if (typeof companyNameQuery !== 'string') {
			return res.status(400).send({ error: 'Zapytanie companyNameQuery jest nieprawidłowy. Odśwież stronę.' });
		}

		let querySearch = { publish: false, 'inputs.companyName.value': { $regex: companyNameQuery } };

		if (publishQuery === 'publikowane') {
			querySearch = { publish: true, 'inputs.companyName.value': { $regex: companyNameQuery } };
		}

		if (publishQuery === 'niepublikowane') {
			querySearch = { publish: false, 'inputs.companyName.value': { $regex: companyNameQuery } };
		}

		if (publishQuery === 'wszystkie-ogloszenia') {
			querySearch = { 'inputs.companyName.value': { $regex: companyNameQuery } };
		}

		const ads = await Ad.find(querySearch).sort({ date: 'descending' });

		return res.status(200).send({ searchedAds: ads });
	} catch (e) {
		console.log('Err for: sendSearchedAdminAdsCotroller ------------->\n' + e);

		return res.status(500).send({
			error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
		});
	}
}