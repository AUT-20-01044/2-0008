const deviceController = require("../device.controller");
const httpMocks = require("node-mocks-http");
const sinon = require("sinon");

const Device = require("../../../2-0010/models/device.model");

const mockFunc = jest.fn();

jest.mock("../device.services", () => () => {
  return {
    registerDevice: mockFunc,
  };
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Test device controller", () => {
  describe("Test registerDevice Function", () => {
    test("Status 201 when success", async () => {
      mockFunc.mockImplementation(() => {
        return new Promise((resolve, reject) => {
          let result = {
            _id: "51226",
          };
          resolve(result);
        });
      });

      const request = httpMocks.createRequest({
        jwt: {
          userId: "1337",
        },
      });
      const response = httpMocks.createResponse();

      await deviceController.insert(request, response);

      expect(response.statusCode).toBe(201);
    });

    test("Status 400 when error", async () => {
      mockFunc.mockImplementation(() => {
        return Promise.reject({
          errors: { name: { message: "Error", kind: "unique" } },
        });
      });

      const request = httpMocks.createRequest({
        jwt: {
          userId: "1337",
        },
      });
      const response = httpMocks.createResponse();

      await deviceController.insert(request, response);

      expect(response.statusCode).toBe(400);
    });
  });

  describe("test getDeviceByID function", () => {
    test("Status 200 when success", async () => {
      Device.findById = jest.fn().mockResolvedValue("Device");
      // mockingoose(Device).toReturn({ name: "test" }, "findById");

      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await deviceController.getDeviceByID(request, response);

      expect(response.statusCode).toBe(200);
    });

    test("Status 404 when no device", async () => {
      Device.findById = jest.fn().mockResolvedValue();
      // mockingoose(Device).toReturn({ name: "test" }, "findById");

      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await deviceController.getDeviceByID(request, response);

      expect(response.statusCode).toBe(404);
    });

    test("Status 400 when error with id", async () => {
      Device.findById = jest.fn().mockRejectedValue({
        message: "Error",
        kind: "ObjectId",
      });
      // mockingoose(Device).toReturn({ name: "test" }, "findById");

      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await deviceController.getDeviceByID(request, response);

      expect(response.statusCode).toBe(400);
    });

    test("Status 500 when all other errors", async () => {
      Device.findById = jest.fn().mockRejectedValue({ kind: "other" });
      // mockingoose(Device).toReturn({ name: "test" }, "findById");

      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await deviceController.getDeviceByID(request, response);

      expect(response.statusCode).toBe(500);
    });
  });
});
