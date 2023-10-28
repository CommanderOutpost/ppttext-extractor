const express = require('express');
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const apiRouter = express.Router();

const powerpointRouter = require('./powerpointRouter');
const uploadFileRouter = require('./uploadFile');

apiRouter.use(morgan('dev'));
apiRouter.use('/uploadFile', uploadFileRouter);
apiRouter.use('/powerpoint', powerpointRouter);

apiRouter.use(errorhandler(), (err, req, res, next) => {
    if (!err.status) {
        err.status = 500;
    }
    return res.status(err.status).send(err.message);
});

module.exports = apiRouter;