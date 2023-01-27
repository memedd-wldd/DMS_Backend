const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageSchema = Schema(
  {
    platform: {
      type: String,
      required: true,
    },
    pageName: {
      type: String,
      required: true,
    },
    pageStatus: {
      type: String,
      default: "Active",
    },
    inactiveReasons: {
      type: String,
    },
    pageCategory: {
      type: String,
      required: true,
    },
    pageHandle: {
      type: String,
    },
    tags: {
      type: Object,
    },
    link: {
      type: String,
      required: true,
    },
    pageType: {
      type: String,
    },

    //pageStats
    followers: {
      type: String,
    },
    avgLikes: {
      type: String,
    },
    avgReelViews: {
      type: String,
    },
    avgComments: {
      type: String,
    },
    wlddPoc: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bucket: {
      type: String,
    },
    nextReview: {
      type: String,
    },
    eng: {
      type: String,
    },
    pageIndex: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: {
      type: String,
    },
    subscribers: {
      type: String,
    },
    avgReach: {
      type: String,
    },
    city: [
      {
        type: String,
      },
    ],
    pageLanguage: {
      type: String,
    },
    contentProduction: {
      type: String,
    },
    comment: {
      type: String,
    },
    distributors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Distributor",
      },
    ],
    commercials: [
      {
        type: Schema.Types.ObjectId,
        ref: "Commercial",
      },
    ],
    entity: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
pageSchema.index({ pageName: "text", platform: "text", poc: "text" });

module.exports = mongoose.model("Page", pageSchema);
