const express = require("express");
const cors = require("cors");

const access_code = "3544"

const app = express();

app.use(cors())
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(15016, () => {
  console.log("Application online.");
});
