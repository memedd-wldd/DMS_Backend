const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postingTrackerSchema = Schema(
  {
    pages: [
      {
        pageName: {
          type: String,
          required: true,
        },
        pagePlatForm: {
          type: String,
          required: true,
        },
        pageHandle: {
          type: String,
          required: true,
        },
        pageCategory: {
          type: String,
          required: true,
        },
        pageLink: {
          type: String,
          required: true,
        },
        pageURL: {
          type: String,
          default: "",
        },
        pageType: {
          type: String,
          required: true,
        },
        pageLikes: {
          type: Number,
          required: true,
        },
        pageViews: {
          type: Number,
          required: true,
        },
        pageComments: {
          type: Number,
          required: true,
        },
        pageImpressions: {
          type: Number,
          required: true,
        },
        pageEngagement: {
          type: Number,
          required: true,
        },
        pageShares: {
          type: Number,
          required: true,
        },
        pageSave: {
          type: Number,
          required: true,
        },
        pageCost: {
          type: Number,
          default: 0,
        },
        pageChargeCost: {
          type: Number,
          default: 0,
        },
        followers: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
        },
        modifiedAt: {
          type: Date,
        },
        distributor: {
          type: Schema.Types.ObjectId,
          ref: "Distributor",
        },
        commercial: {
          type: Schema.Types.ObjectId,
          ref: "Commercial",
          default: null,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        postingDate: {
          type: Date,
          default: null,
        },
      },
    ],
    distributionPlan: {
      type: Schema.Types.ObjectId,
      ref: "DistributionPlan",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    paymentSheetID: {
      type: String,
      default: "",
    },
    dataUpdating: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PostingTracker", postingTrackerSchema);
