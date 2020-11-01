const deviceServices = require("../device.services");
const sinon = require("sinon");

describe("Device Services Testing", () => {
  test("Module exists", () => {
    expect(deviceServices).toBeDefined();
  });

  test("register device", () => {
    const save = sinon.spy();
    let type, name, clientId, userId;

    const mockModel = function (data) {
      userId = data.userId;
      clientId = data.clientId;
      name = data.name;
      type = data.type;

      return {
        ...data,
        save,
      };
    };

    deviceServices(mockModel).registerDevice({
      type: "CS",
      name: "Cell Stretcher",
      userId: "321321",
      clientId: "23132",
    });

    expect(save.calledOnce).toEqual(true);
    expect(type).toEqual("CS");
  });

  test("findByUserId", () => {
    const find = jest.fn();

    const mockModel = function () {
      return {
        find,
      };
    };

    device = new mockModel();

    deviceServices(device).findByUserId("1337");

    expect(find).toHaveBeenCalled();
    expect(find).toBeCalledWith(expect.objectContaining({ userId: "1337" }));
  });
});
