const express = require("express");
const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("app is ok!");
});
app.listen(PORT, () => {
  console.log(`app listen in ${PORT} successfully!`);
});
