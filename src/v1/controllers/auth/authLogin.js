const User = require("../../models/user");
const Roles = require("../../models/roles");
const Jwt = require("jsonwebtoken");
const Bcryptjs = require("bcryptjs");
const config = require("../../../config/config");
const error = require("../../helpers/errormsg");

exports.postLogin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName, isDeleted: false }).populate('role');

    if (!user) {
      error(422, "This User is not Registered or Disabled");
    }
    const hashPassword = await Bcryptjs.compare(password, user.password);
    if (!hashPassword) {
      error(422, "Invalid Password");
    }
    
    const token = Jwt.sign(
      { id: user._id, isBlocked: user.isDeleted, roleId: user.role },
      config.JWT_ACTIVATE,
      { expiresIn: "7d" }
    );

    const userRole = user.role;
    const responseUser = {...user._doc};
    delete responseUser.password;
    delete responseUser.forgetPasswordOtp;
    delete responseUser.expTime;

    res.status(200).json({
      status: true,
      message: "Successfully logged in",
      data: {
        user:{...responseUser},
        token,
        userRole,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.validateToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (token) {
      const verify = Jwt.verify(token, config.JWT_ACTIVATE);
      if (verify) {
        return res.status(200).json({
          status: true,
          message: "Success",
          data: "",
        });
      } else {
        error(422, "unauthorize to access");
      }
    } else {
      error(422, "provide token");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
