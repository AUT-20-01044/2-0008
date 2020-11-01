const crypto = require("crypto");

const hashPassword = (User) => (password) => {
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("base64");

  return salt + "$" + hash;
};

const findByEmail = (User) => (email) => {
  return User.find({ email: email });
};

const createUser = (User) => (userData) => {
  const user = new User(userData);
  return user.save();
};

module.exports = (User) => {
  return {
    createUser: createUser(User),
    hashPassword: hashPassword(User),
    findByEmail: findByEmail(User),
  };
};
