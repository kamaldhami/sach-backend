var express = require('express')
const indexRouter = express.Router();
const userRouter = require('./user.route');

indexRouter.use('/user', userRouter);

module.exports = indexRouter;