//#region <Library Imports>
const express = require('express');
//#endregion

//#region <Project Imports>
require('../database/mongodb');
const originConfig = require("../config/cors");
const apiRouter = require('../routes/api.route');
const errorCallBack = require('../config/error-callback');
//#endregion


//#region <Instances>
const app = express();
app.use(express.static('public'));
//#endregion

//#region <Security>
app.use(originConfig);
//#endregion


//#region <Body parser and formdata>
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json({
    limit: '100mb'
}));
//#endregion

// app.use('/public', express.static(path.join('public')));
// app.use(express.static(path.join(__dirname, '../', '')));

app.use(apiRouter);

//#region <Error Handling>

app.use(errorCallBack());

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...", err);
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! Shutting down...", err);
    process.exit(1);
});

//#endregion

module.exports = app;