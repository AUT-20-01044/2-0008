const authValidationMiddleware = require("../auth.validation.middleware");
const httpMocks = require("node-mocks-http");
const sinon = require("sinon");

const validJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjQzN2FlNWFlZWZkNzY1ZTAyMTZmZWUiLCJlbWFpbCI6InJjQHRlc3QuY29tIiwicHJvdmlkZXIiOiJlbWFpbCIsIm5hbWUiOiJSb2IgY2FyZXkiLCJyZWZyZXNoS2V5IjoiMWJCV2R5TmtPWXR4Wm84SFJ5cU93QT09IiwiaWF0IjoxNTk4MzQxNTMzfQ.jDdI3LAnVxTOvb2S6DmlA9CvQR_8BcHJcO30OG8jFmU";
const validRefresh =
  "TmhlV0MvOGltZDFrNUxuMDlrS0RZTE10TTVqVG9FR2RLNGxXY3kvYnVuQ0J0M05IUzNVTi9pemdNWi8vSFdYazliZmRYTzNVU0NUWittQVZaUVZUVFE9PQ==";

describe("Test auth.validation.middleware", () => {
  test("module exists", () => {
    expect(authValidationMiddleware).toBeDefined;
  });

  describe("test verifyRefreshBodyField function", () => {
    test("Status 400 when no refresh_token", () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      authValidationMiddleware.verifyRefreshBodyField(request, response);

      expect(response.statusCode).toBe(400);
    });

    test("next is called when refresh_token is present", () => {
      const next = sinon.spy();

      const request = httpMocks.createRequest({
        body: {
          refresh_token: "someValue",
        },
      });
      const response = httpMocks.createResponse();

      authValidationMiddleware.verifyRefreshBodyField(request, response, next);

      expect(response.statusCode).toBe(200);
      expect(next.calledOnce).toEqual(true);
    });
  });

  describe("test validJWTNeeded function", () => {
    test("Status 400 when no authorization provided", () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      authValidationMiddleware.validJWTNeeded(request, response);

      expect(response.statusCode).toBe(400);
    });

    test("Status 403 when invalid JWT sent", () => {
      const request = httpMocks.createRequest({
        headers: { authorization: "Basic notValid" },
      });
      const response = httpMocks.createResponse();

      authValidationMiddleware.validJWTNeeded(request, response);

      expect(response.statusCode).toBe(403);
    });

    test("Status 400 when authorization doesn't includ type", () => {
      const request = httpMocks.createRequest({
        headers: {
          authorization: validJWT,
        },
      });
      const response = httpMocks.createResponse();

      authValidationMiddleware.validJWTNeeded(request, response);

      expect(response.statusCode).toBe(400);
    });

    test("next is called when valid authorization is given", () => {
      const next = sinon.spy();

      const request = httpMocks.createRequest({
        headers: {
          authorization: "Basic " + validJWT,
        },
      });
      const response = httpMocks.createResponse();

      authValidationMiddleware.validJWTNeeded(request, response, next);

      expect(response.statusCode).toBe(200);
      expect(next.calledOnce).toEqual(true);
    });
  });

  describe("Test validRefreshNeeded", () => {
    test("Status 401 when invalid refresh_token", () => {
      const request = httpMocks.createRequest({
        body: {
          refresh_token: "invalid",
        },
        jwt: {
          userId: "5f437ae5aeefd765e0216fee",
          email: "rc@test.com",
          provider: "email",
          name: "Rob carey",
          refreshKey: "1bBWdyNkOYtxZo8HRyqOwA==",
          iat: 1598341533,
        },
      });
      const response = httpMocks.createResponse();

      authValidationMiddleware.validRefreshNeeded(request, response);

      expect(response.statusCode).toBe(401);
    });

    test("next is called when valid refresh_token", () => {
      const next = sinon.spy();

      const request = httpMocks.createRequest({
        body: {
          refresh_token: validRefresh,
        },
        jwt: {
          userId: "5f437ae5aeefd765e0216fee",
          email: "rc@test.com",
          provider: "email",
          name: "Rob carey",
          refreshKey: "1bBWdyNkOYtxZo8HRyqOwA==",
          iat: 1598341533,
        },
      });
      const response = httpMocks.createResponse();

      authValidationMiddleware.validRefreshNeeded(request, response, next);

      expect(response.statusCode).toBe(200);
      expect(next.calledOnce).toEqual(true);
    });
  });
});
