const request = require("supertest");
const mongooseService = require("../../../2-0010/services/mongoose.service");
const config = require("../../config/env.config");

// test database for testing
mongooseService.connect(config.mongo.address + config.mongo.port + "/device_routes_test_db");

const validJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjQzN2FlNWFlZWZkNzY1ZTAyMTZmZWUiLCJlbWFpbCI6InJjQHRlc3QuY29tIiwicHJvdmlkZXIiOiJlbWFpbCIsIm5hbWUiOiJSb2IgY2FyZXkiLCJyZWZyZXNoS2V5IjoiMWJCV2R5TmtPWXR4Wm84SFJ5cU93QT09IiwiaWF0IjoxNTk4MzQxNTMzfQ.jDdI3LAnVxTOvb2S6DmlA9CvQR_8BcHJcO30OG8jFmU";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const deviceRouter = require("../device.routes");

app.use(bodyParser.json());

deviceRouter.routesConfig(app);

describe("Device routes test", () => {
  test("modules exist", () => {
    expect(app).toBeDefined();
    expect(deviceRouter).toBeDefined();
  });

  let server;

  beforeAll(() => {
    server = app.listen(3602);
  });

  afterAll((done) => {
    mongooseService.disconnect();
    server.close(done);
  });

  test("can post to /device", async () => {
    await request(server)
      .post("/device")
      .set({ Authorization: "Basic " + validJWT })
      .send({
        type: "CS",
        name: "Cell Stretcher",
        userId: "321321",
        clientId: "23132",
      })
      .expect(201);
  });
});
