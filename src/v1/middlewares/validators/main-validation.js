const Role = require("../../models/roles");
const PageValidation = require("../../lib/pageValidation");
const error = require("../../helpers/errormsg");

module.exports = async (req, res, next) => {
  try {
    const roleId = req.roleId;
    const method = req.method;
    const roleName = req.roleName;
    const fieldRestriction = req.fieldRestriction;
    const collectionName = req.collectionName;

    if (
      collectionName !== "page" &&
      collectionName !== "distributor" &&
      collectionName !== "commercials" &&
      collectionName !== "user"
    ) {
      error(406, "Not allowed");
    }
    if (method === "create") {
      const { flag, fieldArray } = PageValidation(
        fieldRestriction,
        collectionName
      );
      if (flag !== 1) {
        if (fieldArray) {
          req.fieldArray = fieldArray;
        } else {
          req.fieldArray = [];
        }
        next();
      } else {
        error(406, "Don't have access");
      }
    } else if (method === "update") {
      const { flag, fieldArray } = PageValidation(
        fieldRestriction,
        collectionName
      );
      if (flag !== 1) {
        req.fieldArray = fieldArray;
        next();
      }
    } else if (method === "enable") {
      if (roleName !== "Admin") {
        return error(406, "Don't have access");
      }
      next();
    } else if (method === "deleteOrEnable") {
      if (roleName !== "Admin") {
        return error(406, "Don't have access");
      }
      next();
    } else if (method === "get") {
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
