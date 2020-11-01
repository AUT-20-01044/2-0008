const config = require("../config/env.config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.login = (req) => {
  if (!req.body.userId) {
    // throw new Error("No userId provided");
    const error = new Error("No userId provided");
    error.status = 400;
    throw error;
  }
  try {
    let refreshId = req.body.userId + config.jwt_secret;
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(refreshId)
      .digest("base64");
    req.body.refreshKey = salt;
    let token = jwt.sign(req.body, config.jwt_secret, {
      expiresIn: config.jwt_expiration_in_seconds,
    });
    let b = new Buffer(hash);
    let refresh_token = b.toString("base64");
    return {
      userId: req.body.userId,
      tokenType: "Basic",
      expiresIn: config.jwt_expiration_in_seconds,
      accessToken: token,
      refreshToken: refresh_token,
    };
  } catch (error) {
    throw error;
  }
};
