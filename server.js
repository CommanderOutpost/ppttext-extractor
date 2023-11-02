// Import required dependencies.
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawnSync } = require('child_process');


try {
  const pythonProcess = spawnSync('python3', [`server/scripts/install_package.py`], { stdio: 'inherit' });
  const error = pythonProcess.stderr?.toString()?.trim();

  if (error) {
    console.error(error);
  }

} catch (error) {
  console.error(error);
}

// Create an Express application.
const app = express();

// Define the port where the server will listen.
const PORT = process.env.PORT || 4001;

// Serve static files from the 'public' directory under the '/public' path.
app.use('/public', express.static('public'));

// Serve the 'index.html' file as the root route ('/') of the application.
app.get('/', (req, res, next) => {
  res.sendFile('index.html', { root: __dirname });
});

// Middleware for handling Cross-Origin Resource Sharing (CORS) requests.
app.use(cors());

// Middleware for parsing JSON request bodies.
app.use(bodyParser.json());

// Mount the 'apiRouter' at the '/api' path, handling API routes.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

// Conditional block for starting the server only when this module is not being imported.
if (!module.parent) {
  // Start the server and listen on the defined PORT.
  app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  });
}

// Export the Express app to make it available for use in other parts of the application.
module.exports = app;
