const Commercial = require("../../models/commercials");
const Role = require("../../models/roles");
const Page = require("../../models/pages");
const PageValidation = require("../../lib/pageValidation");
const Distributor = require("../../models/distributors");
const error = require("../../helpers/errormsg");
const Entity = require("../../models/entities");
const User = require("../../models/user");
const Objdiff = require("deep-object-diff");
const AuditLog = require("../../models/audit-log");
const { pageCreationPostingReady } = require("../../lib/emailNotification");
const { sendMail } = require("../../helpers/sendmail");

exports.createCommercials = async (req, res, next) => {
  try {
    const userId = req.userId;
    const roleId = req.roleId;
    const role = await Role.findById(roleId);
    const fields = role.fieldRestriction;
    const flag = PageValidation(fields, "commercials");

    if (flag === 1) {
      return res.status(200).json({
        status: false,
        message: "Don't have permission",
        data: [],
      });
    }

    const { costing } = req.body;

    let body = {},
      currentCommercial;

    if (costing) {
      body.costing = costing;
    }
    if (salesOps) {
      body.salesOps = salesOps;
    }
    if (status) {
      body.status = status;
    }
    if (payment) {
      body.payment = payment;
    }
    if (closedDate) {
      body.closedDate = closedDate;
    }
    if (agreementDate) {
      body.agreementDate = agreementDate;
    }
    if (link) {
      body.link = link;
    }
    if (nextReview) {
      body.nextReview = nextReview;
    }
    if (agreementEndDate) {
      body.agreementEndDate = agreementEndDate;
    }
    if (entityId) {
      body.entity = entityId;
    } else {
      return res.status(200).json({
        status: false,
        message: "please give entity ID",
        data: "",
      });
    }

    const entity = await Entity.findById(entityId).populate("pages");
    if (!entity) {
      res.status(200).json({
        status: false,
        message: "Entity not found",
        data: "",
      });
    } else {
      const newCommercials = await Commercial.create(body);
      if (entity.commercials.length !== null) {
        const EntityCommercialsArray = entity.commercials;
        // if(commercials.indexOf(newCommercials._id)){
        //   const deleteCommercials = await Commercial.deleteOne({_id:newCommercials._id});
        //   return res.status(200).json({
        //     status:true,
        //     message:"commercial is already present",
        //     data:''
        //   })
        // }else{
        EntityCommercialsArray.push(newCommercials._id);
        entity.commercials = EntityCommercialsArray;
        const updateEntity = await entity.save();
        currentCommercial = newCommercials;
        //}
      } else {
        let newCommercialsEntityArray = [];
        newCommercialsEntityArray.push(newCommercials._id);
        entity.commercials = newCommercialsEntityArray;
        const updateEntity = await entity.save();
        currentCommercial = newCommercials;
      }

      const pages = entity.pages?.map((page) => {
        return {
          pageName: page.pageName,
          platform: page.platform,
          link: page.link,
        };
      });

      if (body.status === "postingReady") {
        let mailObject = pageCreationPostingReady(
          pages?.[0].platform,
          pages?.[0].pageName,
          pages?.[0].link,
          entity._id
        );

        const mail = await sendMail(
          mailObject.audience,
          mailObject.subject,
          "",
          mailObject.body
        );

        if (!mail) {
          return res.status(501).json({
            status: false,
            message: "Error in sending mail",
            data: "",
          });
        }
      }
    }
    res.status(200).json({
      status: true,
      message: "Commercials created",
      data: currentCommercial,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCommercialsByEntityId = async (req, res, next) => {
  try {
    const { entityId } = req.body;
    const entity = await Commercial.findOne({ entityId: entityId }).populate(
      "entityId distributorId"
    );
    if (entity) {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: entity,
      });
    } else {
      return res.status(501).json({
        status: true,
        message: "Don't have commercials",
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

exports.addCostingToDistributors = async (req, res, next) => {
  try {
    const userId = req.userId;
    const roleId = req.roleId;
    const role = await Role.findById(roleId);
    const fields = role.fieldRestriction;
    const flag = PageValidation(fields, "commercials");
    if (flag === 1) {
      return res.status(200).json({
        status: false,
        message: "Don't have permission",
        data: [],
      });
    }

    const { distributorId, costing, entityId, onboarding } = req.body;

    const distributor = await Distributor.findById(distributorId);
    let entity = await Entity.findById(entityId).populate("pages");
    const editingUser = await User.findById(userId);
    let entityWithCommercials = distributor.entityWithCommercials;
    let connectedDistributors = distributor.entity;
    let connectedEntity = entity.distributors;

    if (entityWithCommercials.indexOf(entityId) !== -1) {
      return res.status(406).json({
        status: false,
        message: "Already entered",
        data: "",
      });
    }

    let body = {
      entityId,
      distributorId,
      costing,
      onboarding,
    };

    entityWithCommercials.push(entityId);
    distributor.entityWithCommercials = entityWithCommercials;

    if (connectedDistributors.indexOf(entityId) === -1) {
      connectedDistributors.push(entityId);
    }

    if (connectedEntity.indexOf(distributorId) === -1) {
      connectedEntity.push(distributorId);
      await entity.save();
    }

    const createCommercials = await Commercial.create(body);
    distributor.commercials.push(createCommercials._id);

    console.log(entity.primaryCommercial, !entity.primaryCommercial);
    if (!entity.primaryCommercial) {
      entity.primaryCommercial = createCommercials._id;
      await entity.save();
    }

    let pages = entity.pages?.map((page) => {
      return {
        pageName: page.pageName,
        platform: page.platform,
        wlddPoc: page.wlddPoc,
      };
    });

    if (body.onboarding.status === "postingReady") {
      let mailObject = pageCreationPostingReady(
        pages?.[0].platform,
        pages?.[0].pageName,
        pages?.[0].link,
        entityId,
        pages?.[0].wlddPoc?.name
      );

      const mail = await sendMail(
        mailObject.audience,
        mailObject.subject,
        "",
        mailObject.body
      );

      if (!mail) {
        return res.status(501).json({
          status: false,
          message: "Error in sending mail",
          data: "",
        });
      }
    }

    // audit log section

    let audit_body = {
      userName: editingUser.userName,
      userId: userId,
      entityId: entityId,
      previousData: {},
      updatedData: {},
      operation: "Added Commercials",
      changeData: {
        collection: "commercials",
      },
    };

    const auditLog = await AuditLog.create(audit_body);

    await distributor.save();
    return res.status(200).json({
      status: true,
      message: "Success",
      data: createCommercials,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getOnboardDistributors = async (req, res, next) => {
  try {
    const { entityId, distributorId } = req.body;

    const distributor = await Commercial.find({
      distributorId: distributorId,
      entityId: entityId,
    });

    if (!distributor) {
      error(406, "Distributor is not associated with this entity");
    }
    res.status(200).json({
      status: true,
      message: "Success",
      data: distributor,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateCommercials = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id, distributorId, costing, entityId, onboarding } = req.body;
    const body = {};
    if (costing) {
      body.costing = costing;
    }
    if (onboarding) {
      body.onboarding = onboarding;
    }

    // audit log  section

    const editUser = await User.findById(userId).select("userName");

    const previousCommercialsData = await Commercial.findById(id);

    const previousData = {
      ...previousCommercialsData._doc,
    };

    //console.log(previousData);
    const updatedData = {
      ...body,
    };

    let costingData = Objdiff.detailedDiff(
      previousData.costing,
      updatedData.costing
    );
    let onboardingData = Objdiff.detailedDiff(
      previousData.onboarding[0],
      updatedData.onboarding
    );
    let changeData = {
      costingData,
      onboardingData,
    };
    //console.log(changeData);

    const audit_body = {
      userName: editUser.userName,
      userId: userId,
      entityId: entityId,
      previousData: previousData,
      updatedData: updatedData,
      operation: "Update Commercials",
      changeData: {
        changeData,
        collection: "commercials",
      },
    };

    const allDetails = await Entity.findById(entityId).populate("pages");

    const pages = allDetails.pages?.map((page) => {
      return {
        pageName: page.pageName,
        platform: page.platform,
        link: page.link,
      };
    });

    console.log(pages);
    if (updatedData.onboarding.status === "postingReady") {
      let mailObject = pageCreationPostingReady(
        pages?.[0].platform,
        pages?.[0].pageName,
        pages?.[0].link,
        entityId
      );

      const mail = await sendMail(
        mailObject.audience,
        mailObject.subject,
        "",
        mailObject.body
      );

      if (!mail) {
        return res.status(501).json({
          status: false,
          message: "Error in sending mail",
          data: "",
        });
      }
    }

    if (Object.keys(changeData).length !== 0) {
      const auditLog = await AuditLog.create(audit_body);
    }

    const updatedCommercials = await Commercial.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (updatedCommercials) {
      return res.status(200).json({
        status: true,
        message: "updated ",
        data: updatedCommercials,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "failed to update",
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
