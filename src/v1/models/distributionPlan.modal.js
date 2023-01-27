const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const distributionPlanSchema = Schema(
  {
    distributionPlanName: {
      type: String,
      required: true,
    },

    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
    spreadSheetId: {
      type: String,
      default: "",
    },
    expenseSheetId: {
      type: String,
      default: "",
    },
    revenueSheetId: {
      type: String,
      default: "",
    },
    distributionSheetId: {
      type: String,
      default: "",
    },
    folderId: {
      type: String,
      default: "",
    },
    sheetsID: [
      {
        type: Number,
        default: "",
      },
    ],
    pages: {
      instagram: [
        {
          type: Object,
          required: true,
        },
      ],
      facebook: [
        {
          type: Object,
          required: true,
        },
      ],
      twitter: [
        {
          type: Object,
          required: true,
        },
      ],
      youtube: [
        {
          type: Object,
          required: true,
        },
      ],
      linkedin: [
        {
          type: Object,
          required: true,
        },
      ],
    },
    bundles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bundle",
      },
    ],
    postingTracker: {
      type: Schema.Types.ObjectId,
      ref: "PostingTracker",
    },
    overallEngagement: {
      type: String,
      default: "",
    },
    overallReach: {
      type: String,
      default: "",
    },
    internalCost: {
      type: Number,
      default: 0,
    },
    externalCost: {
      type: Number,
      default: 0,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isDrafted: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("DistributionPlan", distributionPlanSchema);
