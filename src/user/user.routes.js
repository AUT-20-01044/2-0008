const UserController = require("./user.controller");

exports.routesConfig = function (app) {
  app.post("/users", [UserController.insert]);
};
