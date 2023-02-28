const express = require("express");
const cors = require("cors");

const access_code = "3544"

const app = express();

app.use(cors())
app.use((req, res, next) => {
  if (req.query.code) {
    if (req.query.code == access_code) {
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    next();
  }
})
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Application online.");
});
