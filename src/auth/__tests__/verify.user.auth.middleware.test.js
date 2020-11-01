const VerifyUserMiddleware = require("../middlewares/verify.user.auth.middleware");
const httpMocks = require("node-mocks-http");
const sinon = require("sinon");

const mockFunc = jest.fn();

jest.mock("../../user/user.services", () => () => {
  return {
    findByEmail: mockFunc,
  };
});

describe("Test verify.user.auth.middleware", () => {
  describe("Test hasAuthValidFields function", () => {
    test("400 response is thrown when nothing is passed", () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      VerifyUserMiddleware.hasAuthValidFields(request, response);
      expect(response.statusCode).toBe(400);
    });

    test("400 response is thrown when no password is passed", () => {
      const request = httpMocks.createRequest({
        body: {
          email: "rc@test",
        },
      });
      const response = httpMocks.createResponse();

      VerifyUserMiddleware.hasAuthValidFields(request, response);
      expect(response.statusCode).toBe(400);
    });

    test("400 response is thrown when no password is passed", () => {
      const request = httpMocks.createRequest({
        body: {
          password: "pass",
        },
      });
      const response = httpMocks.createResponse();

      VerifyUserMiddleware.hasAuthValidFields(request, response);
      expect(response.statusCode).toBe(400);
    });

    test("Successful 200 response when correct values passed in", () => {
      const next = sinon.spy();

      const request = httpMocks.createRequest({
        body: {
          email: "rc@test",
          password: "pass",
        },
      });
      const response = httpMocks.createResponse();

      VerifyUserMiddleware.hasAuthValidFields(request, response, next);

      expect(next.calledOnce).toEqual(true);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Test isPasswordAndUserMatch function", () => {
    test("Test Valid response when correct values passed", async () => {
      mockFunc.mockImplementation(() => {
        return new Promise((resolve, reject) => {
          let user = [
            {
              password:
                "2oCiZhI3QrDjrovXtvkIcQ==$2tWEpscyYXG54YRFCSSqMbbAA9r7WDTPSKGNBMnvQDYr9W7s69h5ja7iZhcUGGkZVSOtzjrxPq4scT3e1A1fmA==",
            },
          ];
          resolve(user);
        });
      });

      const next = sinon.spy();

      const request = httpMocks.createRequest({
        body: {
          email: "rc@test",
          password: "password",
        },
      });
      const response = httpMocks.createResponse();

      await VerifyUserMiddleware.isPasswordAndUserMatch(
        request,
        response,
        next
      );

      expect(response.statusCode).toBe(200);
      expect(next.calledOnce).toEqual(true);
    });

    test("Test 400 response when incorrect password is given", async () => {
      mockFunc.mockImplementation(() => {
        return new Promise((resolve, reject) => {
          let user = [
            {
              password:
                "2oCiZhI3QrDjrovXtvkIcQ==$2tWEpscyYXG54YRFCSSqMbbAA9r7WDTPSKGNBMnvQDYr9W7s69h5ja7iZhcUGGkZVSOtzjrxPq4scT3e1A1fmA==",
            },
          ];
          resolve(user);
        });
      });

      const next = sinon.spy();

      const request = httpMocks.createRequest({
        body: {
          email: "rc@test",
          password: "pa##word",
        },
      });
      const response = httpMocks.createResponse();

      await VerifyUserMiddleware.isPasswordAndUserMatch(
        request,
        response,
        next
      );

      expect(response.statusCode).toBe(400);
      expect(next.calledOnce).toEqual(false);
    });

    test("Test 404 response when user not found", async () => {
      mockFunc.mockImplementation(() => {
        return new Promise((resolve, reject) => {
          let user = [];
          resolve(user);
        });
      });

      const next = sinon.spy();

      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      await VerifyUserMiddleware.isPasswordAndUserMatch(
        request,
        response,
        next
      );

      expect(response.statusCode).toBe(404);
      expect(next.calledOnce).toEqual(false);
    });
  });
});
