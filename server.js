const mongooseService = require("./2-0010/services/mongoose.service");
const config = require("./src/config/env.config");
const app = require("./src/app");

// app.listen(3600);
mongooseService.connect(config.mongo.address + config.mongo.port + "/restapi");

app.listen(config.port, function () {
  console.log("app listening at port %s", config.port);
});
