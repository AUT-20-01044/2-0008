const jwt = require("jsonwebtoken"),
  config = require("../config/env.config.js"),
  crypto = require("crypto");

exports.verifyRefreshBodyField = (req, res, next) => {
  if (req.body.refresh_token) {
    return next();
  } else {
    return res.status(400).send({ error: "need to pass refresh_token field" });
  }
};

exports.validJWTNeeded = (req, res, next) => {
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers.authorization.split(" ");
      if (authorization[0] !== config.jwt_type) {
        return res.status(400).send("missing auth type");
      } else {
        req.jwt = jwt.verify(authorization[1], config.jwt_secret);
        return next();
      }
    } catch (err) {
      return res.status(403).send();
    }
  } else {
    return res.status(400).send({ error: "missing fields" });
  }
};

exports.validRefreshNeeded = (req, res, next) => {
  let b = new Buffer(req.body.refresh_token, "base64");
  let refresh_token = b.toString();
  let hash = crypto
    .createHmac("sha512", req.jwt.refreshKey)
    .update(req.jwt.userId + config.jwt_secret)
    .digest("base64");
  if (hash === refresh_token) {
    req.body = req.jwt;
    delete req.body.exp;
    return next();
  } else {
    return res.status(401).send({ error: "Invalid refresh token" });
  }
};
