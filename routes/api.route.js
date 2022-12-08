var express = require('express')
const apiRouter = express.Router();
const indexRouter = require('./web/index.route');

apiRouter.use('/web', indexRouter);
apiRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up"
    });
});
module.exports = apiRouter;