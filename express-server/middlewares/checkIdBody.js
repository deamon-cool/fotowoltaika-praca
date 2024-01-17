module.exports = (req, res, next) => {
    try {
        const { idKey } = req.body;

        if (idKey === undefined || idKey === null || typeof idKey !== 'string' || idKey === '') {
            return res.status(400).send({ error: 'Nieprawidłowe żądanie' });
        }

        next();
    } catch (e) {
        console.log('Err for: checkIdBody ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}