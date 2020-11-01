const User = require("../../2-0010/models/user.model");
const UserService = require("./user.services");
const authServices = require("../auth/auth.services");

// module.exports = UserService(User);

exports.insert = (req, res) => {
  req.body.password = UserService().hashPassword(req.body.password);

  UserService(User)
    .createUser(req.body)
    .then((result) => {
      // res.status(201).send({ id: result._id });
      req.body.userId = result._id;
      let auth = authServices.login(req);
      if (auth) {
        res.status(201).send(auth);
      }
    })
    .catch((e) => {
      // First error in the errors object returned by mongoose
      let errorFirst = e.errors[Object.keys(e.errors)[0]];
      if (errorFirst.kind) {
        res.status(400).send({ error: errorFirst.message });
      } else {
        res.status(500).send();
      }
    });
};
