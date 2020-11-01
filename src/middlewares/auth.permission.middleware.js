const deviceServices = require("../device/device.services");
const Device = require("../../2-0010/models/device.model");

exports.onlyDeviceOwnerCan = async (req, res, next) => {
  await Device.findById(req.params.deviceId)
    .then((device) => {
      if (device && req.jwt.userId == device.userId) {
        return next();
      } else {
        res.status(404).send(); // 403 not used to hide existence of resource
      }
    })
    .catch((e) => {
      // First error in the errors object returned by mongoose
      if (e.kind == "ObjectId") {
        res.status(400).send({ error: "Error with deviceId given" });
      } else {
        res.status(500).send();
      }
    });
};
