const { defaults } = require("jest-config");
module.exports = {
  verbose: true,
  collectCoverage: true,
  testEnvironment: "node",
  modulePathIgnorePatterns: ["./2-0010"],
};
