const authServices = require("./auth.services");

exports.login = (req, res, next) => {
  try {
    let auth = authServices.login(req);
    if (auth) {
      res.status(201).send(auth);
    }
  } catch (err) {
    next(err);
  }
};
