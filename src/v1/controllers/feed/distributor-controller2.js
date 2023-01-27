const Distributor = require("../../models/distributors");
const Role = require("../../models/roles");
const PageValidation = require("../../lib/pageValidation");
const error = require("../../helpers/errormsg");
const Page = require("../../models/pages");
const Entity = require("../../models/entities");
const Objdiff = require("deep-object-diff");
const AuditLog = require("../../models/audit-log");
const User = require("../../models/user");
const Commercial = require("../../models/commercials");


exports.enableOrDisableDistributor = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { distributorId ,key} = req.body;
  
   if(key === "true"){
      const distributor = await Distributor.findByIdAndUpdate(distributorId,{isDeleted:true})
      const commercialsAssociatesDistributor = await Commercial.updateMany(
        { distributorId: distributorId},
        { $set: { isDeleted: true } }
      );

      return res.status(200).json({
        status: true,
        message: "Distributor Disabled with it's commercials",
        data: "",
      });
  }else if(key === "false"){
    const distributor = await Distributor.findByIdAndUpdate(distributorId,{isDeleted:false});

    const commercialsAssociatesDistributor = await Commercial.updateMany(
      { distributorId: distributorId},
      { $set: { isDeleted: false } }
    );

    return res.status(200).json({
      status: true,
      message: "Distributor enabled with it's commercials",
      data: "",
    });
  }
  else{
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


exports.deleteDistributorFromEntity = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { entityId, distributorId } = req.body;
    const entity = await Entity.findById(entityId);
    const distributor = await Distributor.findById(distributorId);
    const editUser = await User.findById(userId).select('userName');
    let distributorsInEntity = entity.distributors;
    let entityInDistributor = distributor.entity;
    if (distributorsInEntity.indexOf(distributorId) !== -1) {
      distributorsInEntity = distributorsInEntity.filter(
        (item) => String(item) !== distributorId
      );
      entity.distributors = distributorsInEntity;
      await entity.save();
    } else {
      return res.status(406).json({
        status: false,
        message: "Distributor is Not associate with this page",
        data: "",
      });
    }
    if (entityInDistributor.indexOf(entityId) !== -1) {
      entityInDistributor = entityInDistributor.filter(
        (item) => String(item) !== entityId
      );
      distributor.entity = entityInDistributor;
      await distributor.save();
    } else {
      return res.status(406).json({
        status: false,
        message: "Distributor is Not associate with this page",
        data: "",
      });
    }
    const audit_log = {
      userName: editUser.userName,
      userId: userId,
      entityId: entityId,
      previousData: {},
      updatedData: {},
      operation: "Removed Distributor from Page",
      changeData: { collection: "distributor" },
    };

    const audit = await AuditLog.create(audit_log);
    //console.log(audit);
    
    return res.status(200).json({
      status: true,
      message: "Successfully removed from page",
      data: "",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

