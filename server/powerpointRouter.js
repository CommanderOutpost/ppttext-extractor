const express = require('express');
const multer = require('multer');
const { spawnSync } = require('child_process');
const { readFile } = require('fs/promises');
const powerpointRouter = express.Router();

// Configure Multer for handling file uploads. Files will be stored in the 'uploads/' directory.
const upload = multer({ dest: "uploads/" });

// Define a POST route at the root endpoint of the 'uploadFileRouter'.
// This route is responsible for handling file uploads.
powerpointRouter.post("/", upload.single("file"), async (req, res) => {
    try {
        const pythonProcess = await spawnSync('python2', ['server/scripts/powerpoint_text_extractor.py']);
        const result = pythonProcess.stdout?.toString()?.trim();
        const error = pythonProcess.stderr?.toString()?.trim();
        console.log(result);

        if (error) {
            console.error(error);
        }

        const status = result === 'OK';
        if (status) {
            const buffer = await readFile('/usr/src/app/scripts/results.json');
            const resultParsed = JSON.parse(buffer?.toString());
            console.log(resultParsed);
        }
        res.json({ message: "Successfully uploaded files" });

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Export the 'powerpointRouter' to make it available for use in the application.
module.exports = powerpointRouter;