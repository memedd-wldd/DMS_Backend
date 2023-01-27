const Role = require("../../models/roles");
const User = require("../../models/user");
const error = require("../../helpers/errormsg");
const Bcryptjs = require("bcryptjs");
const AuditLog = require("../../models/audit-log");
const { sendMail } = require("../../helpers/sendmail");
const emailText = require("../../lib/login-text");

exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      userName,
      email,
      password,
      phoneNumber,
      roleId,
      driveFolderId,
    } = req.body;
    const user = await User.findOne({ userName: userName });
    if (user) {
      return error(401, "UserName already Taken");
    } else {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(401).json({
          status: false,
          message: "failed",
          data: "",
        });
      }
      const hashPassword = await Bcryptjs.hash(password, 12);
      const body = {
        name,
        userName,
        password: hashPassword,
        roleName: role.roleName,
        role: role._id,
      };
      if (email) {
        body.email = email;
      }
      if (phoneNumber) {
        body.phoneNumber = phoneNumber;
      }
      if (driveFolderId) {
        body.driveFolderId = driveFolderId;
      }
      const nwUser = await User.create(body);
      const text = emailText(userName, password);
      const mail = await sendMail(email, "Login details", "", text);

      if (!mail) {
        return res.status(500).json({
          status: false,
          message: "Something went wrong ,could not send mail",
          data: "",
        });
      }

      res.status(200).json({
        status: true,
        message: "User is created",
        data: nwUser,
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -forgetPasswordOtp -expTime")
      .sort("name");

    if (users) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: users,
      });
    } else {
      error(404, "Don't have any users");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      id,
      phoneNumber,
      name,
      userName,
      password,
      email,
      roleId,
      driveFolderId,
    } = req.body;
    if (!id) {
      return res.status(200).json({
        status: true,
        message: "Failed id not provided",
        data: [],
      });
    }
    const role = await Role.findById(roleId);
    if (!role) {
      return error(406, "Invalid role Id");
    }
    const roleName = role.roleName;

    let body = {};
    if (phoneNumber) {
      body.phoneNumber = phoneNumber;
    }
    if (name) {
      body.name = name;
    }
    if (password) {
      const hashPassword = await Bcryptjs.hash(password, 12);
      body.password = hashPassword;
    }

    if (email) {
      body.email = email;
    }
    if (roleId) {
      body.role = roleId;
      body.roleName = role.roleName;
    }
    if (driveFolderId) {
      body.driveFolderId = driveFolderId;
    }

    const user = await User.findByIdAndUpdate(id, body, { new: true });
    if (!user) {
      error(500, "Invalid user Id");
    }
    return res.status(200).json({
      status: true,
      message: "Updated",
      data: user,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.disableUser = async (req, res, next) => {
  try {
    const { userId, key } = req.body;

    if (key === "true") {
      const user = await User.findByIdAndUpdate(userId, { isDeleted: true });
      if (!user) {
        return res.status(406).json({
          status: false,
          message: "User not found",
          data: "",
        });
      }
      return res.status(200).json({
        status: true,
        message: "user Disabled with it's commercials",
        data: "",
      });
    } else if (key === "false") {
      const user = await User.findByIdAndUpdate(userId, { isDeleted: false });
      if (!user) {
        return res.status(406).json({
          status: false,
          message: "User not found",
          data: "",
        });
      }

      return res.status(200).json({
        status: true,
        message: "user enabled with it's commercials",
        data: "",
      });
    } else {
      return res.status(406).json({
        status: true,
        message: "Invalid operation",
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
