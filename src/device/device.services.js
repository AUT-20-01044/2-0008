const registerDevice = (Device) => (deviceData) => {
  const device = new Device(deviceData);
  return device.save();
};

const findByUserId = (Device) => (userId) => {
  return Device.find({ userId: userId });
};

module.exports = (Device) => {
  return {
    registerDevice: registerDevice(Device),
    findByUserId: findByUserId(Device),
  };
};
