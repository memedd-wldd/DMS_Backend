const Role = require("../../models/roles");
const User = require("../../models/user");
const error = require("../../helpers/errormsg");

exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    if (roles) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: roles,
      });
    } else {
      error(500, "Not found");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
