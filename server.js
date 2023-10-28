const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

module.exports = app;

const PORT = process.env.PORT || 4001;

app.use('/public', express.static('public'));
app.get('/', (req, res, next) => { 
  res.sendFile('index.html', { root: __dirname });
});

// Middleware for handling CORS requests from index.html
app.use(cors());


// Middleware for parsing request bodies here:
app.use(bodyParser.json());


// Mounting existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);


// This conditional is here for testing purposes:
if (!module.parent) { 
  // Add your code to start the server listening at PORT below:
  app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  })
}