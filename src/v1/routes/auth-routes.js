const express = require("express");
const loginController = require("../controllers/auth/authLogin");
const { authLogin } = require("../middlewares/validators/login-validator");

const {
  forgetPasswordChangeValidation,
  verifyOtpValidation,
  forgetPasswordValidation,
} = require("../middlewares/validators/forget-passwordValidators");
const forgetPasswordController = require("../controllers/auth/forgetpassword");
const router = express.Router();

router.post("/login", authLogin, loginController.postLogin);

router.post("/validate_token", loginController.validateToken);

router.post("/forget_password", forgetPasswordValidation, forgetPasswordController.postForgetPassword);

router.post("/verify_otp",verifyOtpValidation, forgetPasswordController.verifyOtp);

router.post("/change_forget_password",forgetPasswordChangeValidation ,forgetPasswordController.forgetPasswordChange)



module.exports = router;
