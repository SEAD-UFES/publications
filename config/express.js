const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const consign = require("consign");
const secrets = require("./secrets.json");
const apiRoutes = require("./apiRoutes.json");

const cors_middleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
};

app.use(cors_middleware, bodyParser.json());

//Load Secrets File.
secrets.forEach(s => {
  app.set(s.key, s.value);
});
//Load API Routes file
apiRoutes.forEach(r => {
  app.set(r.key, r.value);
});

app.set("port", process.env.PORT || 3000);

consign({ cwd: "app" })
  .include("helpers")
  .then("errors")
  .then("models/index.js")
  .then("api")
  .then("routes")
  .then("swagger")
  .into(app);

module.exports = app;
