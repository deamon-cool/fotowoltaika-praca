module.exports = (req, res, next) => {
  try {
    const { editorContent } = req.body;

    if (editorContent === undefined || editorContent === null || typeof editorContent !== 'object' ||
      typeof editorContent.blocks !== 'object' || typeof editorContent.entityMap !== 'object' ||
      editorContent.blocks === null || editorContent.entityMap === null ||
      !Array.isArray(editorContent.blocks)) {
      return res.status(400).send({ error: 'Błąd wysyłania opisu. Odśwież stronę' });
    }

    next();
  } catch (e) {
    console.log('Err for: checkEditorContentBody ------------->\n' + e);

    return res.status(500).send({
      error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
    });
  }
}