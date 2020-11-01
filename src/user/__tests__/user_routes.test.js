const request = require("supertest");
const mongooseService = require("../../../2-0010/services/mongoose.service");
const config = require("../../config/env.config");

// test database for testing
mongooseService.connect(config.mongo.address + config.mongo.port + "/user_routes_test_db");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const UsersRouter = require("../user.routes");

app.use(bodyParser.json());

UsersRouter.routesConfig(app);

describe("Users routes test", () => {
  test("modules exist", () => {
    expect(app).toBeDefined();
    expect(UsersRouter).toBeDefined();
  });

  let server;

  beforeAll(() => {
    server = app.listen(3601);
  });

  afterAll((done) => {
    mongooseService.disconnect();
    server.close(done);
  });

  test("can post users", async () => {
    await request(server)
      .post("/users")
      .send({
        firstName: "foo",
        lastName: "bar",
        email: "email@email",
        password: "password",
      })
      .expect(201);
  });
});
