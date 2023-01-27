const Validator = require("validator");
const Bcryptjs = require("bcryptjs");
const Pocs = require("../../models/user");
const error = require("../../helpers/errormsg");

module.exports = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const password = req.body.password;
    const name =  req.body.name;
    const email = req.body.email;
    const roleId = req.body.roleId;
    const phoneNumber = req.body.phoneNumber;

    if (Validator.isEmpty(password)) {
      error(406, "Password cannot be empty");
    }

    if (Validator.isEmpty(userName)) {
      error(406, "Username can not be blank");
    }
    if (Validator.isEmpty(email)) {
        error(406, "Please add email ");
    }
    if (Validator.isEmpty(phoneNumber)) {
        error(406, "Please add Phone Number");
    }
    if (Validator.isEmpty(name)) {
        error(406, "name can not be blank");
    }
    // if (Validator.isEmpty(roleName)) {
    //     error(406, "Role can not be blank");
    // }
    if (Validator.isEmpty(roleId)) {
      error(406, "Role Id can not be blank");
  }

    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};