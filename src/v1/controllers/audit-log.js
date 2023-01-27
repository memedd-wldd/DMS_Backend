const Audit = require("../models/audit-log");

exports.getAllAuditLog = async (req, res, next) => {
  try {
    const { pageNo, skip, limit, entityId } = req.body;
    const auditLogs = await Audit.find({ entityId: entityId }).select('-__v')
      .skip(skip)
      .limit(limit).sort('-createdAt');
    const docLength = await Audit.find({ entityId: entityId }).count()

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
