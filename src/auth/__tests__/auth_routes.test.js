const request = require("supertest");
const mongooseService = require("../../../2-0010/services/mongoose.service");
const config = require("../../config/env.config");

// test database for testing
mongooseService.connect(config.mongo.address + config.mongo.port + "/auth_routes_test_db");

const User = require("../../../2-0010/models/user.model");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const authRouter = require("../auth.routes");

app.use(bodyParser.json());

authRouter.routesConfig(app);

const validJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjQzN2FlNWFlZWZkNzY1ZTAyMTZmZWUiLCJlbWFpbCI6InJjQHRlc3QuY29tIiwicHJvdmlkZXIiOiJlbWFpbCIsIm5hbWUiOiJSb2IgY2FyZXkiLCJyZWZyZXNoS2V5IjoiMWJCV2R5TmtPWXR4Wm84SFJ5cU93QT09IiwiaWF0IjoxNTk4MzQxNTMzfQ.jDdI3LAnVxTOvb2S6DmlA9CvQR_8BcHJcO30OG8jFmU";
const validRefresh = "TmhlV0MvOGltZDFrNUxuMDlrS0RZTE10TTVqVG9FR2RLNGxXY3kvYnVuQ0J0M05IUzNVTi9pemdNWi8vSFdYazliZmRYTzNVU0NUWittQVZaUVZUVFE9PQ==";

describe("Users routes test", () => {
  test("modules exist", () => {
    expect(app).toBeDefined();
    expect(authRouter).toBeDefined();
  });

  let server;

  beforeAll(() => {
    server = app.listen(3000);
  });

  afterAll(() => {
    server.close();
    mongooseService.disconnect();
  });

  test("can post to auth/refresh", async () => {
    await request(server)
      .post("/auth/refresh")
      .send({
        email: "rc@email",
        password: "password",
        refresh_token: validRefresh,
      })
      .set({ Authorization: "Basic " + validJWT })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
      });
  });

  test("can post to auth", async () => {
    const user = new User({
      firstName: "foo",
      lastName: "bar",
      email: "rc@email",
      password: "2oCiZhI3QrDjrovXtvkIcQ==$2tWEpscyYXG54YRFCSSqMbbAA9r7WDTPSKGNBMnvQDYr9W7s69h5ja7iZhcUGGkZVSOtzjrxPq4scT3e1A1fmA==",
    });
    await user.save();

    await request(server)
      .post("/auth")
      .send({
        email: "rc@email",
        password: "password",
      })
      .expect(201);
  });

  test("status 200 when /auth/valid and valid jwt", async () => {
    const user = new User({
      firstName: "foo",
      lastName: "bar",
      email: "rc@email",
      password: "2oCiZhI3QrDjrovXtvkIcQ==$2tWEpscyYXG54YRFCSSqMbbAA9r7WDTPSKGNBMnvQDYr9W7s69h5ja7iZhcUGGkZVSOtzjrxPq4scT3e1A1fmA==",
    });
    await user.save();

    await request(server)
      .post("/auth/valid")
      .send()
      .set({ Authorization: "Basic " + validJWT })
      .expect(200);
  });

  test("error when no userId in body", async () => {
    await request(server).post("/auth").expect(400);
  });
});
