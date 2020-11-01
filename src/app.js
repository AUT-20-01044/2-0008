const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const UsersRouter = require("./user/user.routes");
const AuthRouter = require("./auth/auth.routes");
const DeviceRouter = require("./device/device.routes");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.send(200);
  } else {
    return next();
  }
});

app.use(bodyParser.json());

UsersRouter.routesConfig(app);
AuthRouter.routesConfig(app);
DeviceRouter.routesConfig(app);

module.exports = app;
