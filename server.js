const app = require('./app')
require("dotenv").config();
const UPLOAD_DIR = process.env.UPLOAD_DIR
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    return console.log("Sry, we have a problem:", err);
  }
  await mkdirp(UPLOAD_DIR)
  await mkdirp(AVATAR_OF_USERS)
  console.log(`Server running. Use our API on port: ${PORT}`)
})
