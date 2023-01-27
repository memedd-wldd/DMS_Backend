const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entitySchema = Schema(
  {
    uuid: {
      type: String,
    },
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
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

    primaryDistributor: {
      type: Schema.Types.ObjectId,
      ref: "Distributor",
    },

    primaryCommercial: {
      type: Schema.Types.ObjectId,
      ref: "Commercial",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: {
      type: String,
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

module.exports = mongoose.model("Entity", entitySchema);
