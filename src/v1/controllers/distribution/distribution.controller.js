const DistributionPlan = require("../../models/distributionPlan.modal");
const Campaign = require("../../models/campaign.modal");
const auditLogCampaign = require("../../models/audit-log-campaign");
const Objdiff = require("deep-object-diff");

exports.createDistributionPlan = async (req, res, next) => {
  try {
    const data = req.body;

    // find distribution plan already exists by campaignId
    const distributionPlanAlreadyExists = await DistributionPlan.findOne({
      campaignId: data.campaignId,
      isDelete: false,
    });

    if (distributionPlanAlreadyExists) {
      return res.status(400).json({
        status: false,
        message: "Distribution Plan already exists",
      });
    }

    const distributionPlan = await DistributionPlan.create(data);

    //  update the create campaign distributionPlan key by new distributionPlan id
    if (distributionPlan) {
      const campaign = await Campaign.findByIdAndUpdate(data.campaignId, {
        distributionPlan: distributionPlan._id,
      });

      let audit_body = {
        userId: data.createdBy,
        campaignId: data.campaignId,
        previousData: {},
        updatedData: {},
        operation: "Distribution Created",
        changeData: { distributionPlan, collection: "distributionPlan" },
      };

      const audit_log = await auditLogCampaign.create(audit_body);

      res.status(200).json({
        status: true,
        message: "Distribution Plan created successfully",
        data: distributionPlan,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      message: error.message,
    });
  }
};

// update distribution plan by id
exports.updateDistributionPlanById = async (req, res, next) => {
  try {
    const { id } = req.body;

    const previousData = await DistributionPlan.findById(id)
      .select("-__v")
      .lean()
      .lean();

    const distributionPlan = await DistributionPlan.findByIdAndUpdate(
      id,
      req.body
    )
      .select("-__v")
      .lean();

    if (distributionPlan) {
      const changedData = Objdiff.detailedDiff(previousData, req.body);

      const audit_body = {
        userId: distributionPlan.createdBy,
        campaignId: distributionPlan.campaignId,
        previousData: previousData,
        updatedData: distributionPlan,
        operation: "Update Distribution Plan",
        changeData: { changedData, collection: "distributionPlan" },
      };

      console.log(audit_body);

      if (Object.keys(changedData).length > 0) {
        // tracking the data in audit log
        const audit_log = await auditLogCampaign.create(audit_body);
      }

      res.status(200).json({
        status: true,
        message: "Distribution Plan updated successfully",
        data: distributionPlan,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Distribution Plan id is invalid",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      message: error.message,
    });
  }
};

// get distribution plan by id
exports.getDistributionPlanById = async (req, res, next) => {
  try {
    const { id } = req.body;
    const distributionPlan = await DistributionPlan.findById(id);

    if (distributionPlan) {
      res.status(200).json({
        status: true,
        message: "Distribution Plan fetched successfully",
        data: distributionPlan,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
