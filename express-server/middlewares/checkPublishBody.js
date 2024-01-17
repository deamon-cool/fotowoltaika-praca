module.exports = (req, res, next) => {
    try {
        const { publish } = req.body;

        if (typeof publish !== 'boolean') {
            return res.status(400).send({ error: 'Nieprawidłowe żądanie' });
        }

        next();
    } catch (e) {
        console.log('Err for: checkPublishBody ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}