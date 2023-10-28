const express = require('express');
const multer = require('multer');
const { uploadFiles } = require('./utils');
const uploadFileRouter = express.Router();

const upload = multer({ dest: "uploads/" });

uploadFileRouter.post("/", upload.single("file"), uploadFiles);

module.exports = uploadFileRouter;