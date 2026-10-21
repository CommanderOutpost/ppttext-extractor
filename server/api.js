// Import the required dependencies.
const express = require('express');
const morgan = require('morgan');

// Create an Express Router for the API routes.
const apiRouter = express.Router();

// Import specific routers for different parts of the API.
const extractRouter = require('./extractRouter'); // Handles PowerPoint-related routes.

// Use Morgan middleware for logging HTTP request details.
apiRouter.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Mount the 'powerpointRouter' at the '/extract/powerpoint' endpoint.
apiRouter.use('/extract', extractRouter);

function statusFor(err) {
    switch (err.code) {
        case 'LIMIT_FILE_SIZE':
            return 413;
        case 'LIMIT_FILE_COUNT':
        case 'LIMIT_UNEXPECTED_FILE':
            return 400;
        default:
            return err.status || 500;
    }
}

// Error handling middleware to catch and handle errors in the API.
// Client errors keep their message; server errors are logged and hidden so we
// never leak stack traces or filesystem paths.
apiRouter.use((err, req, res, next) => {
    const status = statusFor(err);
    if (status >= 500) {
        console.error(`[api] ${req.method} ${req.originalUrl}:`, err);
    }
    return res.status(status).send(status >= 500 ? 'Internal Server Error' : err.message);
});

// Export the API router to make it available for use in the application.
module.exports = apiRouter;
