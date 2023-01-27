const Validator = require("validator");
const Bcryptjs = require("bcryptjs");
const Pocs = require("../../models/user");
const error = require("../../helpers/errormsg");

exports.distributorValidation = async (req, res, next) => {
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
      } = req.body;

    if (Validator.isEmpty(adminName)) {
      error(406, "Admin Name cannot be empty");
    }

    if (Validator.isEmpty(distributorType)) {
      error(406, "Distributor Type  can not be blank");
    }

    if (Validator.isEmpty(email)) {
        error(406, "email can not be blank");
    }

    if (Validator.isEmpty(whatsApp)) {
      error(406, "Username can not be blank");
    }

    if (Validator.isEmpty(phone)) {
        error(406, "Phone Number can not be blank");
    }

    if (Validator.isEmpty(email)) {
        error(406, "email can not be blank");
    }

    // if (Validator.isEmpty(accoutHolderName)) {
    //   error(406, "Account Number can not be blank");
    // }
    // if (Validator.isEmpty(accountNumber)) {
    //     error(406, "Account Number can not be blank");
    // }
    // if (Validator.isEmpty(bankName)) {
    //     error(406, "bank Name can not be blank");
    // }
    // if (Validator.isEmpty(branchName)) {
    //   error(406, "branch Name can not be blank");
    // }
    // if (Validator.isEmpty(accountType)) {
    //     error(406, "Account Type can not be blank");
    // }
    // if (Validator.isEmpty(ifsc)) {
    //     error(406, "ifsc can not be blank");
    // }
    // if (Validator.isEmpty(upiId)) {
    //   error(406, "Upi Id can not be blank");
    // }
    
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
