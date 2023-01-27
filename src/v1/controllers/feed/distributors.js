const Distributor = require("../../models/distributors");
const Role = require("../../models/roles");
const PageValidation = require("../../lib/pageValidation");
const error = require("../../helpers/errormsg");
const Page = require("../../models/pages");
const Entity = require("../../models/entities");
const Objdiff = require("deep-object-diff");
const AuditLog = require("../../models/audit-log");
const User = require("../../models/user");

exports.createDistributors = async (req, res, next) => {
  try {
    const {
      adminName,
      distributorType,
      phone,
      whatsApp,
      AgencyName,
      website,
      email,
      accoutHolderName,
      accountNumber,
      bankName,
      panNo,
      gstNo,
      upiId,
      branchName,
      accountType,
      ifsc,
      sameAsPhone,
      whatsAppGroup,
    } = req.body;

    const existingDistributor = await Distributor.findOne({
      email: email,
      phone: phone,
    });

    if (existingDistributor) {
      return res.status(406).json({
        status: false,
        message: "Distributor is already present with same Email and phone",
        data: "",
      });
    }

    let body = {};
    if (adminName) {
      body.adminName = adminName;
    }
    if (distributorType) {
      body.distributorType = distributorType;
    }
    if (phone) {
      body.phone = phone;
    }
    if (whatsApp) {
      body.whatsApp = whatsApp;
    }
    if (AgencyName) {
      body.AgencyName = AgencyName;
    }
    if (website) {
      body.website = website;
    }
    if (email) {
      body.email = email;
    }
    if (accoutHolderName) {
      body.accoutHolderName = accoutHolderName;
    }
    if (accountNumber) {
      body.accountNumber = accountNumber;
    }
    if (bankName) {
      body.bankName = bankName;
    }
    if (panNo) {
      body.panNo = panNo;
    }
    if (gstNo) {
      body.gstNo = gstNo;
    }
    if (upiId) {
      body.upiId = upiId;
    }
    if (branchName) {
      body.branchName = branchName;
    }
    if (accountType) {
      body.accountType = accountType;
    }
    if (ifsc) {
      body.ifsc = ifsc;
    }
    if (sameAsPhone) {
      body.sameAsPhone = sameAsPhone;
    }
    if (whatsAppGroup) {
      body.whatsAppGroup = whatsAppGroup;
    }

    const distributors = await Distributor.create(body);

    res.status(200).json({
      status: true,
      message: "success",
      data: distributors,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.searchDistributor = async (req, res, next) => {
  try {
    const { adminName } = req.body;
    const name = await Distributor.find({ $text: { $search: adminName } });
    if (name.length !== 0) {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: name,
      });
    } else {
      error("404", "Not found");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllDistributors = async (req, res, next) => {
  try {
    const distributors = await Distributor.find()
      .select("id AgencyName adminName email isDeleted phone whatsApp")
      .sort("adminName");
    if (distributors) {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: distributors,
      });
    } else {
      error(500, "No distributors available");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllDistributorsByPageId = async (req, res, next) => {
  try {
    const { pageId } = req.body;
    const distributor = await Page.findById(pageId).populate("distributors");
    if (pageId) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: distributor,
      });
    } else {
      res.status(501).json({
        status: true,
        message: "page doesn't exist",
        data: [],
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getDistributorsById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (id) {
      const distributorDetails = await Distributor.findById(id);
      if (distributorDetails) {
        return res.status(200).json({
          status: true,
          message: "Success",
          data: distributorDetails,
        });
      } else {
        error(501, "Not found distributors");
      }
    } else {
      error(501, "Please send a valid Id");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getDistributorsByEntityId = async (req, res, next) => {
  try {
    const userId = req.userId;
    const roleId = req.roleId;
    const role = await Role.findById(roleId);

    const fields = role.fieldRestriction;
    const flag = PageValidation(fields, "distributor");

    if (flag === 1) {
      return res.status(200).json({
        status: false,
        message: "Don't have permission",
        data: [],
      });
    }

    const { entityId } = req.body;
    if (entityId) {
      const distributors = await Entity.findById(entityId).populate(
        "distributors"
      );
      if (!distributors) {
        error(406, "not found");
      } else {
        return res.status(200).json({
          status: true,
          message: "Success",
          data: distributors,
        });
      }
    } else {
      error(406, "send valid id");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateDistributor = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      id,
      adminName,
      distributorType,
      phone,
      whatsApp,
      AgencyName,
      website,
      email,
      accoutHolderName,
      accountNumber,
      bankName,
      panNo,
      gstNo,
      upiId,
      branchName,
      accountType,
      ifsc,
      entityId,
      whatsAppGroup,
    } = req.body;

    let body = {};
    if (adminName) {
      body.adminName = adminName;
    }
    if (distributorType) {
      body.distributorType = distributorType;
    }
    if (phone) {
      body.phone = phone;
    }
    if (whatsApp) {
      body.whatsApp = whatsApp;
    }
    if (AgencyName) {
      body.AgencyName = AgencyName;
    }
    if (website) {
      body.website = website;
    }
    if (email) {
      body.email = email;
    }
    if (accoutHolderName) {
      body.accoutHolderName = accoutHolderName;
    }
    if (accountNumber) {
      body.accountNumber = accountNumber;
    }
    if (bankName) {
      body.bankName = bankName;
    }
    if (panNo) {
      body.panNo = panNo;
    }
    if (gstNo) {
      body.gstNo = gstNo;
    }
    if (upiId) {
      body.upiId = upiId;
    }
    if (branchName) {
      body.branchName = branchName;
    }
    if (accountType) {
      body.accountType = accountType;
    }
    if (ifsc) {
      body.ifsc = ifsc;
    }
    if (whatsAppGroup) {
      body.whatsAppGroup = whatsAppGroup;
    }

    //audit log

    const editUser = await User.findById(userId);
    const previousDistributorData = await Distributor.findById(id);

    const previousData = {
      ...previousDistributorData._doc,
    };

    //console.log(previousData);
    const updatedData = {
      ...body,
    };

    //console.log(updatedData);
    let changeData = Objdiff.detailedDiff(previousData, updatedData);
    //console.log(changeData);

    const audit_body = {
      userName: editUser.userName,
      userId: userId,
      entityId: entityId,
      previousData: previousData,
      updatedData: updatedData,
      operation: "Update Distributor",
      changeData: {
        changeData,
        collection: "distributor",
      },
    };

    if (Object.keys(changeData).length !== 0) {
      const auditLog = await AuditLog.create(audit_body);
    }

    const updateDistributor = await Distributor.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (updateDistributor) {
      return res.status(200).json({
        status: true,
        message: "Updated",
        data: updateDistributor,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Failed to update",
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

// get distributor by pagination
exports.getDistributorsByPagination = async (req, res, next) => {
  try {
    const { page, limit } = req.body;
    if (page && limit) {
      const distributor = await Distributor.find({})
        .skip((page - 1) * limit)
        .limit(limit);

      const docLength = await Distributor.countDocuments();
      if (distributor) {
        return res.status(200).json({
          status: true,
          message: "Successfully fetched",
          data: { distributor, docLength },
        });
      } else {
        error(501, "Not found distributors");
      }
    } else {
      error(501, "Please send a valid Id");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get all distributors
exports.getAllDistributors = async (req, res, next) => {
  try {
    const distributor = await Distributor.find({}).select(
      "-__v -createdAt -updatedAt -pages -entityWithCommercials -entity -commercials"
    );
    if (distributor) {
      return res.status(200).json({
        status: true,
        message: "Successfully fetched",
        data: distributor,
      });
    } else {
      error(501, "Not found distributors");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// create many distributors at once and validate
exports.createManyDistributors = async (req, res, next) => {
  try {
    console.log(req.body, "Data");
    const { distributors } = req.body;

    if (!distributors.length > 0) {
      error(406, "Please send valid data");
    }

    // find existing distributors by email and phone from the request
    const existingDistributors = await Distributor.find({
      $or: [
        {
          email: { $in: distributors.map((distributor) => distributor.email) },
        },
        {
          phone: { $in: distributors.map((distributor) => distributor.phone) },
        },
      ],
    });

    // if existing distributors found, throw error
    if (existingDistributors.length > 0) {
      res.status(200).json({
        status: false,
        message: "Distributors already exists",
        data: existingDistributors,
      });
    } else {
      if (distributors) {
        const data = await Distributor.insertMany(distributors);
        if (data) {
          return res.status(200).json({
            status: true,
            message: "Successfully created",
            data: data,
          });
        }
      } else {
        error(406, "Please send a valid data");
      }
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllDistributorByFilters = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;

    const { agencyName, action, adminName, email, phone } = req.body;
    const query = {}
    if (agencyName) {
      query.agencyName = { $regex: "^" + agencyName, $options: "i" };
    }
    if (action) {
      query.isDeleted = action;
    }
    if (adminName) {
      query.adminName = { $regex: "^" + adminName, $options: "i" };
    }
    if (email) {
      query.email = { $regex: "^" + email, $options: "i" };
    }
    if (phone) {
      query.phone = { $regex: "^" + phone, $options: "i" };
    }

    const distributor = await Distributor.find(query)
      .skip(skip - 1)
      .limit(limit);
    const docLength = await Distributor.countDocuments(query);

    if (distributor) {
      return res.status(200).json({
        status: true,
        message: "Successfully fetched",
        data: { distributor, docLength },
      });
    } else {
      error(501, "Not found distributors");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
