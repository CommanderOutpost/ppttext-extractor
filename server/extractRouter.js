const express = require('express');
const { upload, extractText } = require('./uploadTextExtractor');

const extractRouter = express.Router();

extractRouter.post('/', upload.single('file'), async (req, res, next) => {
    try {
        const extractedText = await extractText(req);
        res.json({ extractedText });
    } catch (error) {
        next(error);
    }
});

module.exports = extractRouter;
