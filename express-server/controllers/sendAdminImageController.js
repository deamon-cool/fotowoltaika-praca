module.exports = async (req, res) => {
    try {
        const { imageName } = req.params;

        return res.status(200).sendFile('./' + imageName, { root: `${process.cwd()}/uploads` });
    } catch (e) {
        console.log('Err for: sendAdminImageController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}