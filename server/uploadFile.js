// Import the required dependencies.
const express = require('express');
const multer = require('multer');
const { uploadFiles } = require('./utils'); // Import a utility function for file uploading.
const uploadFileRouter = express.Router();

// Configure Multer for handling file uploads. Files will be stored in the 'uploads/' directory.
const upload = multer({ dest: "uploads/" });

// Define a POST route at the root endpoint of the 'uploadFileRouter'.
// This route is responsible for handling file uploads.
uploadFileRouter.post("/", upload.single("file"), uploadFiles);

// Export the 'uploadFileRouter' to make it available for use in the application.
module.exports = uploadFileRouter;
