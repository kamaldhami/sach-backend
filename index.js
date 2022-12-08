const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, `.env`)
});
const app = require('./loaders/app');



app.listen(process.env.PORT,
    async () => {
        console.log("Server is up and listening on port : " + process.env.PORT);
    }
);