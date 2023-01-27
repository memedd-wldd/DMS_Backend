const Validator = require("validator");
const error = require("../../helpers/errormsg");

exports.forgetPasswordValidation = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    if (Validator.isEmpty(userName)) {
      error(406, "Please give userName");
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.verifyOtpValidation = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const otp = req.body.otp;

    if (Validator.isEmpty(userName)) {
      error(406, "Please give userName");
    }
    if (Validator.isEmpty(otp)) {
      error(406, "otp is mandatory");
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.forgetPasswordChangeValidation = async (req, res, next) => {
  try {
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const userName = req.body.userName;

    if (Validator.isEmpty(userName)) {
      error(406, "Please provide a valid userName");
    }

    if (Validator.isEmpty(newPassword) || Validator.isEmpty(confirmPassword)) {
      error(406, "Invalid Password");
    }

    if (newPassword !== confirmPassword) {
      error(406, "Password does not matched ");
    }

    next();
  } catch (error) {
    next(error);
  }
};
