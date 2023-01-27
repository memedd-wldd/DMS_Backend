const AuditLogCampaign = require("../models/audit-log-campaign");

// get all audit log by campaignID and sort by time with pagination
exports.getAllAuditLogByCampaignId = async (req, res, next) => {
  try {
    const { skip, limit, campaignId } = req.body;
    const auditLogs = await AuditLogCampaign.find({ campaignId: campaignId })
      .select("-__v")
      .skip(skip)
      .limit(limit)
      .populate("userId", "name userName _id")
      .sort("-createdAt");
    const docLength = await AuditLogCampaign.find({
      campaignId: campaignId,
    }).count();

    if (auditLogs) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: {
          auditLogs,
          docLength,
        },
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed",
        data: auditLogs,
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
