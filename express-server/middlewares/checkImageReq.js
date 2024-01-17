module.exports = (req, res, next) => {
    try {
        const { imageName } = req.params;

        if (imageName === undefined || imageName === null || typeof imageName !== 'string' || imageName === '') {
            return res.status(400).send({ error: 'Nieprawidłowa nazwa obrazu' });
        }

        next();
    } catch (e) {
        console.log('Err for: checkImageReq ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}