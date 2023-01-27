const Campaign = require("../../models/campaign.modal");
const User = require("../../models/user");
const auditLogCampaign = require("../../models/audit-log-campaign");

const mongoose = require("mongoose");

const Objdiff = require("deep-object-diff");
const {
  campaignStageChange,
  newCampaign,
} = require("../../lib/emailNotification");
const { sendMail } = require("../../helpers/sendmail");
const {
  selectPopulateService,
} = require("../../services/selectPopulateService");

// create a crud with soft delete in mongoose for campaign model
exports.createCampaign = async (req, res, next) => {
  try {
    const body = req.body;

    const campaignName = body.campaignName;
    const clientName = body.clientName;

    // find by campaign name and client name and if found return error
    const alreadyCampaign = await Campaign.findOne({
      campaignName,
      clientName,
      isDelete: false,
    });

    if (alreadyCampaign) {
      return res.status(400).json({
        status: false,
        message: "Campaign already exists",
      });
    }

    const campaign = await Campaign.create(body);

    // populate the campaign lead and distribution lead and content lead
    const campaignLead = await User.findById(body.campaignLead);

    if (campaign) {
      const { campaignName, clientName, status, _id } = campaign;
      const mailObject = newCampaign(
        campaignName,
        clientName,
        status,
        campaignLead.name,
        "",
        "",
        _id
      );

      const mail = await sendMail(
        mailObject.audience,
        mailObject.subject,
        "",
        mailObject.body
      );

      console.log(mail);

      if (!mail) {
        return res.status(400).json({
          status: false,
          message: "Mail not sent. Something went wrong",
        });
      }
    }

    if (campaign) {
      // tracking the data in audit log
      let audit_body = {
        userId: body.createdBy,
        campaignId: campaign._id,
        previousData: {},
        updatedData: {},
        operation: "Campaign Created",
        changeData: { campaign, collection: "campaign" },
      };
      const audit_log = await auditLogCampaign.create(audit_body);
    }

    const campaignCreated = await Campaign.findById(campaign._id)
      .populate("createdBy", "name userName _id")
      .populate("campaignLead", "name userName _id")
      .populate("distributionLead", "name userName _id")
      .populate("contentLead", "name userName _id")
      .lean();

    return res.status(200).json({
      status: true,
      message: "success",
      data: campaignCreated,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.editCampaign = async (req, res, next) => {
  try {
    //  check if any field is empty string
    const body = req.body;

    const newBody = {};

    Object.keys(body).forEach((key) => {
      if (body[key] !== "") {
        newBody[key] = body[key];
      }
    });

    if (!Object.keys(newBody).length) {
      return res.status(400).json({
        status: false,
        message: "No data to update",
      });
    }

    const campaignBefore = await Campaign.findById(req.params.id)
      .select("-__v -_id -updatedAt -createdAt")
      .populate("campaignLead", "name userName _id")
      .populate("distributionLead", "name userName _id")
      .populate("contentLead", "name userName _id")
      .lean();

    const campaign = await Campaign.findByIdAndUpdate(
      { _id: req.params.id },
      newBody,
      { new: true }
    )
      .select("-__v -updatedAt -createdAt")
      .populate("campaignLead", "name userName _id")
      .populate("distributionLead", "name userName _id")
      .populate("contentLead", "name userName _id")
      .populate("createdBy", "name userName _id")
      .lean();

    // send mail to user when campaign status is changed
    if (body.status !== campaignBefore.status) {
      const {
        campaignName,
        clientName,
        status,
        campaignLead,
        contentLead,
        distributionLead,
        _id,
      } = campaign;

      const mailObject = campaignStageChange(
        campaignName,
        clientName,
        status,
        campaignLead.name,
        contentLead.name,
        distributionLead.name,
        _id
      );

      const mail = await sendMail(
        mailObject.audience,
        mailObject.subject,
        "",
        mailObject.body
      );

      console.log(mail);

      if (!mail) {
        return res.status(400).json({
          status: false,
          message: "Mail not sent. Something went wrong",
        });
      }
    }

    let changedData = Objdiff.detailedDiff(campaignBefore, campaign);

    const audit_body = {
      userId: newBody.createdBy,
      campaignId: req.params.id,
      previousData: campaignBefore,
      updatedData: newBody,
      operation: "Update Campaign",
      changeData: { changedData, collection: "campaign" },
    };

    if (Object.keys(changedData).length > 0) {
      // tracking the data in audit log
      const audit_log = await auditLogCampaign.create(audit_body);
    }

    return res.status(200).json({
      status: true,
      message: "Success",
      data: campaign,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.fetchCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(
      mongoose.Types.ObjectId(req.params.id)
    ).populate([
      {
        path: "distributionPlan",
        select: selectPopulateService.distributionPopulate.negativeSelect,
        populate: {
          path: "postingTracker",
        },
      },
      {
        path: "campaignLead",
        select: selectPopulateService.userPopulate.select,
      },
      {
        path: "distributionLead",
        select: selectPopulateService.userPopulate.select,
      },
      {
        path: "contentLead",
        select: selectPopulateService.userPopulate.select,
      },
      {
        path: "createdBy",
        select: selectPopulateService.userPopulate.select,
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "success",
      data: campaign,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      { _id: req.params.id },
      { isDelete: true },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "success",
      data: campaign,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.fetchAllCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.find({ isDelete: false }).populate([
      {
        path: "campaignLead",
        select: selectPopulateService.userPopulate.select,
      },
      {
        path: "distributionLead",
        select: selectPopulateService.userPopulate.select,
      },
      {
        path: "contentLead",
        select: selectPopulateService.userPopulate.select,
      },
      {
        path: "distributionPlan",
        select: selectPopulateService.distributionPopulate.negativeSelect,
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "success",
      data: campaign,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get all campaign with pagination
exports.fetchAllCampaignPagination = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const campaign = await Campaign.find({ isDelete: false })
      .populate("campaignLead", "name userName _id")
      .populate("distributionLead", "name userName _id")
      .populate("contentLead", "name userName _id")
      .skip(parseInt(page) * parseInt(limit))
      .limit(parseInt(limit))
      .sort("-createdAt");

    const docLength = await Campaign.find({ isDelete: false }).count();

    return res.status(200).json({
      status: true,
      message: "success",
      data: { campaign, docLength },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get campaigns by status with pagination
exports.fetchCampaignsByStatusPagination = async (req, res, next) => {
  try {
    const { page, limit, status, campaignName } = req.query;

    const query = {
      status,
      isDelete: false,
    };

    if (campaignName) {
      query.campaignName = { $regex: campaignName, $options: "i" };
    }

    console.log(query);

    const campaign = await Campaign.find(query)
      .populate("campaignLead", "name userName _id")
      .populate("distributionLead", "name userName _id")
      .populate("contentLead", "name userName _id")
      .populate("distributionPlan")
      .skip(parseInt(Number(page) ? page - 1 : page) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const docLength = await Campaign.find(query).count();

    return res.status(200).json({
      status: true,
      message: "success",
      data: { campaign, docLength },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// fetch campaigns by  filters
exports.fetchCampaignsByFilters = async (req, res, next) => {
  try {
    const {
      campaignName,
      clientName,
      status,
      campaignSize,
      campaignLead,
      distributionLead,
      contentLead,
      campaignBudget,
      campaignStartDate,
      campaignEndDate,
      distributionStartDate,
      distributionEndDate,
    } = req.body;

    const campaign = await Campaign.find({
      campaignName,
      clientName,
      status,
      campaignSize,
      campaignLead,
      distributionLead,
      contentLead,
      campaignBudget,
      campaignStartDate,
      campaignEndDate,
      distributionStartDate,
      distributionEndDate,
      isDelete: false,
    })
      .populate("campaignLead", "name userName _id")
      .populate("distributionLead", "name userName _id")
      .populate("contentLead", "name userName _id");

    return res.status(200).json({
      status: true,
      message: "success",
      data: campaign,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get campaigns by status
exports.fetchCampaignsByStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const campaign = await Campaign.find({
      status,
      isDelete: false,
    })
      .populate("campaignLead", "name userName _id")
      .populate("distributionLead", "name userName _id")
      .populate("contentLead", "name userName _id");

    return res.status(200).json({
      status: true,
      message: "success",
      data: campaign,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//get all the unique client from the campaign collection
exports.fetchAllClient = async (req, res, next) => {
  try {
    const client = await Campaign.find({ isDelete: false }).distinct(
      "clientName"
    );

    return res.status(200).json({
      status: true,
      message: "All Clients fetched successfully",
      data: client,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
