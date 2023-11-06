// uploadTextExtractor.js
const multer = require('multer');
const { spawnSync } = require('child_process');
const { readFile, unlink } = require('fs/promises');
const path = require('path');

// Define a function to filter file types
function fileFilter(req, file, cb) {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname === '.pptx') {
      return cb(null, true);
    }
    const error = new Error('Only .pptx files are allowed!');
    error.status = 400;
    cb(error);
  }

const storage = multer.diskStorage({
    destination: 'server/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter,
});

async function extractText(req, next) {
    if (!req.file) {
        const error = new Error('No file was uploaded');
        error.status = 400;
        throw error;
    }

    const pythonProcess = await spawnSync('python3', ['server/scripts/powerpoint_text_extractor.py']);
    const error = pythonProcess.stderr?.toString()?.trim();

    if (error) {
        throw new Error(error);
    }

    const filePath = 'server/extracted_text.txt';
    const extractedText = await readFile(filePath, 'utf-8');

    // Clean up the extracted file
    await unlink(filePath);

    return extractedText;
}

module.exports = { upload, extractText };
