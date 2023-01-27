const configDev = require("./config-dev");
const configProd = require("./config-prod");

let config = {};

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === "dev") {
  config = { ...configDev };
} else if (process.env.NODE_ENV === "prod") {
  config = { ...configProd };
}

module.exports = config;
