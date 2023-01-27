const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditCampaignSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    operation: {
      type: String,
    },
    previousData: {
      type: Object,
    },
    updatedData: {
      type: Object,
    },
    changeData: {
      type: JSON,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLogCampaign", auditCampaignSchema);
