const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campaignSchema = Schema(
  {
    campaignName: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    campaignSize: {
      type: String,
      required: true,
    },
    campaignType: {
      type: String,
      required: true,
    },
    campaignLead: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    distributionLead: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    contentLead: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    campaignBudget: {
      type: Number,
      required: true,
    },
    campaignStartDate: {
      type: Date,
      required: true,
    },
    campaignEndDate: {
      type: Date,
      required: true,
    },
    cancelReason: {
      type: String,
      default: "",
    },
    reasonOther: {
      type: String,
      default: "",
    },
    comments: {
      type: String,
      default: "",
    },
    distributionStartDate: {
      type: Date,
    },
    distributionEndDate: {
      type: Date,
    },
    driveFolderId: {
      type: String,
      default: "",
    },
    activeFolderId: {
      type: String,
      default: "",
    },
    insightsFolderId: {
      type: String,
      default: "",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    distributionPlan: {
      type: Schema.Types.ObjectId,
      ref: "DistributionPlan",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
