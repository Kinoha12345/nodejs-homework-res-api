require('dotenv').config()
const mongoose = require('mongoose');

function dbConnection() {
    mongoose.connect(
        process.env.URI,
        err => {
            if (err) {
                console.log('err: ', err);
                process.exit(1)
            }
            if (!err) {
                console.log("Database connection successful");
            }
        }
        )
}

module.exports = dbConnection;