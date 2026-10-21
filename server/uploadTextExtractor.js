// uploadTextExtractor.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const multer = require('multer');

const execFileAsync = promisify(execFile);

const uploadsDirectory = path.join(__dirname, 'uploads');
const scriptPath = path.join(__dirname, 'scripts', 'powerpoint_text_extractor.py');
const pythonExecutable = process.env.PYTHON || 'python3';

// Multer will not create the destination directory for us.
fs.mkdirSync(uploadsDirectory, { recursive: true });

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_OUTPUT_SIZE = 16 * 1024 * 1024; // 16 MB of extracted text
const EXTRACTION_TIMEOUT_MS = 30_000;

function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

// Define a function to filter file types
function fileFilter(req, file, cb) {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname === '.pptx') {
        return cb(null, true);
    }
    cb(httpError(400, 'Only .pptx files are allowed!'));
}

const storage = multer.diskStorage({
    destination: uploadsDirectory,
    filename: (req, file, cb) => {
        // Unique names: Date.now() collides for concurrent uploads.
        cb(null, `${crypto.randomUUID()}.pptx`);
    },
});

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
});

// A .pptx is a ZIP archive, so it must start with the ZIP local-file header.
async function looksLikeZip(filePath) {
    const handle = await fs.promises.open(filePath, 'r');
    try {
        const buffer = Buffer.alloc(4);
        const { bytesRead } = await handle.read(buffer, 0, 4, 0);
        return bytesRead === 4 && buffer.equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
    } finally {
        await handle.close();
    }
}

async function extractText(req) {
    if (!req.file) {
        throw httpError(400, 'No file was uploaded');
    }

    const filePath = req.file.path;

    try {
        if (!(await looksLikeZip(filePath))) {
            throw httpError(400, 'Uploaded file is not a valid .pptx file');
        }

        const { stdout } = await execFileAsync(pythonExecutable, [scriptPath, filePath], {
            maxBuffer: MAX_OUTPUT_SIZE,
            timeout: EXTRACTION_TIMEOUT_MS,
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
        });

        return stdout;
    } catch (error) {
        if (error.status) {
            throw error;
        }
        if (error.code === 'ENOENT' || error.code === 'EACCES') {
            console.error(`[extract] cannot run ${pythonExecutable}: ${error.message}`);
            throw httpError(500, 'Text extraction is unavailable');
        }

        const detail = error.stderr ? error.stderr.trim() : error.message;
        console.error(`[extract] failed to parse ${path.basename(filePath)}: ${detail}`);
        throw httpError(422, 'Could not extract text from the presentation');
    } finally {
        // Never leave uploaded files behind, even when parsing fails.
        await fs.promises.unlink(filePath).catch(() => {});
    }
}

module.exports = { upload, extractText };
