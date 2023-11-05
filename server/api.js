// Import the required dependencies.
const express = require('express');
const morgan = require('morgan');
const errorhandler = require('errorhandler');

// Create an Express Router for the API routes.
const apiRouter = express.Router();

// Import specific routers for different parts of the API.
const extractRouter = require('./extractRouter'); // Handles PowerPoint-related routes.

// Use Morgan middleware for logging HTTP request details in a 'dev' format.
apiRouter.use(morgan('dev'));

// Mount the 'powerpointRouter' at the '/extract/powerpoint' endpoint.
apiRouter.use('/extract', extractRouter);

// Error handling middleware to catch and handle errors in the API.
apiRouter.use(
    errorhandler(),
    (err, req, res, next) => {
        if (!err.status) {
            // Set the status to 500 (Internal Server Error) if not already defined.
            err.status = 500;
        }
        // Send an error response with the error message and status code.
        return res.status(err.status).send(err.message);
    }
);

// Export the API router to make it available for use in the application.
module.exports = apiRouter;
