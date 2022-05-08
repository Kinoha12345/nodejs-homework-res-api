const app = require('./app')
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    return console.log("Sry, we have a problem:", err);
  }
  console.log(`Server running. Use our API on port: ${PORT}`)
})
