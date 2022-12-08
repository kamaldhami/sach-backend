const cors = require('cors');
const whiteListedOrigins = [];

let originConfig = null;

if (whiteListedOrigins.length) {
    originConfig = cors({
        origin: function (origin, callback) {
            if (whiteListedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Origin not allowed!!"));
            }
        }
    });
} else {
    originConfig = cors();
}

module.exports = originConfig;