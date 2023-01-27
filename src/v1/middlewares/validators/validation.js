const Validator = require("validator");
const Role = require("../../models/roles");
const Page = require("../../models/pages");
const error = require("../../helpers/errormsg");
const Jwt = require("jsonwebtoken");
const config = require("../../../config/config");

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      error(403, "You are not authorized please login first");
    }
    const token = req.get("Authorization").split(" ")[1];

    const decoded = Jwt.verify(token, config.JWT_ACTIVATE);

    if (!decoded) {
      error(401, "Token Expires Please Login ");
    }
    const { id, isBlocked, roleId } = decoded;

    req.userId = id;
    req.roleId = roleId;

    if (isBlocked) {
      return res.status(404).json({
        status: false,
        message: "You are blocked",
        data: [],
      });
    }
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
