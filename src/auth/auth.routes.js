const authController = require("./auth.controller");
const authValidationMiddleware = require("../middlewares/auth.validation.middleware");
const VerifyUserMiddleware = require("./middlewares/verify.user.auth.middleware");

exports.routesConfig = function (app) {
  app.post("/auth", [
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUserMiddleware.isPasswordAndUserMatch,
    authController.login,
  ]);

  app.post("/auth/refresh", [
    authValidationMiddleware.validJWTNeeded,
    authValidationMiddleware.verifyRefreshBodyField,
    authValidationMiddleware.validRefreshNeeded,
    authController.login,
  ]);

  app.post("/auth/valid", [
    authValidationMiddleware.validJWTNeeded,
    (req, res, next) => {
      res.status(200).send({ valid: true });
    },
  ]);

  app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).send({ error: "Something failed!" });
    }
    next(err);
  });
};
