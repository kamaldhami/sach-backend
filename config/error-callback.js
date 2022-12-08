const {
    MONGO_SERVER_ERROR,
    PROGRAMMING_ERROR,
    SESSION_EXPIRE,
    INTERNAL_SERVER_ERROR
} = require('../constants/messages');

const errorCallBack = () => {
    return (err, req, res, next) => {
        console.error(`\n${new Date()}  \n Route : ${req.originalUrl} \n Name :  ${err.name} \n Message :  ${err.message} \n Stack : ${err.stack}`, );
        const {
            name,
            message
        } = err;
        let status = 0,
            displayMsg = "";
        switch (name) {
            case "request entity too large":
                status = 400;
                displayMessage = INTERNAL_SERVER_ERROR;
                break;
            case "ValidationError":
                status = 400;
                displayMsg = message;
                break;
            case "MongoServerError":
                status = 500;
                displayMsg = MONGO_SERVER_ERROR;
                break;
            case "ReferenceError":
                status = 500;
                displayMsg = PROGRAMMING_ERROR;
                break;
            case "JsonWebTokenError":
                status = 403;
                displayMsg = message;
                break;
            case "TokenExpiredError":
                status = 403;
                displayMsg = SESSION_EXPIRE;
                break;
            case "BSONTypeError":
                status = 400;
                displayMsg = message;
                break;
            case "PermissionError":
                status = 403;
                displayMsg = message;
                break;
            case "Error":
                status = 400;
                displayMsg = message;
                break;
            default:
                status = 500;
                displayMsg = message || INTERNAL_SERVER_ERROR;
        }
        res.status(status).json({
            message: displayMsg
        });
    };
};

module.exports = errorCallBack;