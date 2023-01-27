const User = require("../../models/user");
const { sendMail } = require("../../helpers/sendmail");
const genOtp = require("../../helpers/gen-otp");
const text = require("../../lib/text");
const error = require("../../helpers/errormsg");
const BcryptJs = require("bcryptjs");

exports.postForgetPassword = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ userName: userName, isDeleted: false });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found or blocked",
        data: "",
      });
    }
    const email = user.email;
    const otp = genOtp();
    const currDate = new Date();
    const expTime = new Date(currDate.getTime() + 30 * 60000);
    (user.forgetPasswordOtp = otp), (user.expTime = expTime);
    const updatedUser = await user.save();
    const emailText = text(otp);

    const mail = await sendMail(email, "forget Password", "", emailText);
    if (!mail) {
      return res.status(500).json({
        status: true,
        message: "Something went wrong ,could not send mail",
        data: "",
      });
    }
    res.status(200).json({
      status: true,
      message: "Please check your email",
      data: "",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { userName, otp } = req.body;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found",
        data: "",
      });
    }
    const currentDate = new Date();
    const userTime = user.expTime;
    if (userTime < currentDate) {
      return res.status(200).json({
        status: false,
        message: "OTP expired",
        data: "",
      });
    }
    const actualOtp = user.forgetPasswordOtp;
    if (actualOtp !== otp) {
      return res.status(200).json({
        status: false,
        message: "OTP does not matched",
        data: "",
      });
    } else {
      user.forgetPasswordOtp = null;
      user.expTime = null;
      await user.save();
      res.status(200).json({
        status: true,
        message: "Successfully login pls change your password",
        data: "",
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.forgetPasswordChange = async (req, res, next) => {
  try {
    const { userName, newPassword } = req.body;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found",
        data: "",
      });
    }
    const hashPassword = await BcryptJs.hash(newPassword, 12);
    user.password = hashPassword;

    const updatedUser = await user.save();

    res.status(200).json({
      status: true,
      message: "Password changed",
      data: "",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
