const mongoose = require("mongoose");

const config = require("../../config/config");

const connectDB = async () => {
  return mongoose
    .connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connectDB;
