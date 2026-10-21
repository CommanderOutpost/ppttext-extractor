// Import required dependencies.
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an Express application.
const app = express();

// Define the port where the server will listen.
const PORT = process.env.PORT || 4001;

// Middleware for handling Cross-Origin Resource Sharing (CORS) requests.
// Set CORS_ORIGIN to a comma-separated allowlist in production.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : '*';
app.use(cors({ origin: corsOrigin }));

// Middleware for parsing JSON request bodies.
app.use(bodyParser.json());

// Liveness probe for hosting platforms.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount the 'apiRouter' at the '/api' path, handling API routes.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

// Start the server only when this file is run directly, not when it is imported
// by the tests.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  });
}

// Export the Express app to make it available for use in other parts of the application.
module.exports = app;
