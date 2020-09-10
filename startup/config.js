const config = require("config");

module.exports = function () {
  if (!config.get("adminPrivateKey")) {
    throw new Error("FATAL ERROR: adminPrivateKey is not defined.");
  } else if (!config.get("userPrivateKey")) {
    throw new Error("FATAL ERROR: userPrivateKey is not defined.");
  }
};
