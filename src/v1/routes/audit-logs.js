const express = require("express");
const auditController = require("../controllers/audit-log");
const auditControllerCampaign = require("../controllers/audit-log-campaign");
const authValidator = require("../middlewares/validators/validation");

const router = express.Router();

router.post(
  "/getAll_audit_logs",
  authValidator,
  auditController.getAllAuditLog
);

router.post(
  "/getAll_audit_logs_by_campaignId",
//   authValidator,
  auditControllerCampaign.getAllAuditLogByCampaignId
);

module.exports = router;
