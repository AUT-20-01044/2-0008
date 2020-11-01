const Device = require("../../2-0010/models/device.model");
const deviceServices = require("./device.services");

// module.exports = UserService(User);

exports.insert = async (req, res) => {
  req.body.userId = req.jwt.userId;

  await deviceServices(Device)
    .registerDevice(req.body)
    .then((result) => {
      res.status(201).send({ id: result._id });
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

exports.getUserDevices = async (req, res) => {
  await Device.find({ userId: req.jwt.userId })
    .then((devices) => {
      res.status(200).send(devices);
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

exports.getDeviceByID = async (req, res) => {
  await Device.findById(req.params.deviceId)
    .then((device) => {
      if (device) {
        res.status(200).send(device);
      } else {
        res.status(404).send();
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
