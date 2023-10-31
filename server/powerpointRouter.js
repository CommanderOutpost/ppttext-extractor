const express = require('express');
const multer = require('multer');
const { spawnSync } = require('child_process');
const { readFile } = require('fs/promises');
const { unlink } = require('fs');
const powerpointRouter = express.Router();

// Configure Multer for handling file uploads. Files will be stored in the 'uploads/' directory.
const upload = multer({ dest: 'server/uploads/' });

// Define a POST route at the root endpoint of the 'uploadFileRouter'.
// This route is responsible for handling file uploads.
powerpointRouter.post('/', upload.single('file'), async (req, res) => {

    try {
        const pythonProcess = await spawnSync('python3', ['server/scripts/powerpoint_text_extractor.py']);
        const error = pythonProcess.stderr?.toString()?.trim();

        if (error) {
            throw new Error(error);
        }

        const filePath = 'server/extracted_text.txt';

        const extractedText = await readFile(filePath, 'utf-8');

        unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        res.json({ extractedText });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the 'powerpointRouter' to make it available for use in the application.
module.exports = powerpointRouter;