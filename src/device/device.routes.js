const deviceController = require("./device.controller");
const authValidationMiddleware = require("../middlewares/auth.validation.middleware");
const authPermissonMiddleware = require("../middlewares/auth.permission.middleware");

exports.routesConfig = (app) => {
  app.post("/device", [
    authValidationMiddleware.validJWTNeeded,
    deviceController.insert,
  ]);

  app.get("/device", [
    authValidationMiddleware.validJWTNeeded,
    deviceController.getUserDevices,
  ]);

  app.get("/device/:deviceId", [
    authValidationMiddleware.validJWTNeeded,
    authPermissonMiddleware.onlyDeviceOwnerCan,
    deviceController.getDeviceByID,
  ]);
};
