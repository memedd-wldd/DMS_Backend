const Validator = require("validator");
const Bcryptjs = require("bcryptjs");
const Pocs = require("../../models/user");
const error = require("../../helpers/errormsg");

exports.authLogin = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const password = req.body.password;

    if (Validator.isEmpty(password)) {
      error(406, "Password cannot be empty");
    }

    if (Validator.isEmpty(userName)) {
      error(406, "Username can not be blank");
    }

    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
