const Role = require("../../models/roles");
const Page = require("../../models/pages");
const Distributor = require("../../models/distributors");
const User = require("../../models/user");
const PageValidation = require("../../lib/pageValidation");
const FieldValidation = require("../../lib/fieldValidation");
const Entity = require("../../models/entities");
const error = require("../../helpers/errormsg");
const Objdiff = require("deep-object-diff");
const AuditLog = require("../../models/audit-log");

exports.deletePage = async (req, res, next) => {
  try {
    const { pageId } = req.body;
    const page = await Page.findById(pageId);
    if (page) {
      page.isDeleted = true;
      await page.save();
      res.status(200).json({
        status: true,
        message: "page deleted Successfully",
        data: "",
      });
    } else {
      res.status(500).json({
        status: false,
        message: "failed",
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
