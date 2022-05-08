const mongoose = require('mongoose');

function dbConnection() {
    mongoose.connect(
        'mongodb+srv://BETRAYAL:qweqwe123@cluster0.qjj8f.mongodb.net/db-contacts?retryWrites=true&w=majority',
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