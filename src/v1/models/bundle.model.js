// create a bundle model by mongoose

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bundleSchema = Schema(
  {
    bundleName: {
      type: String,
      required: true,
    },
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
    },
    archivedDate: {
      type: Date,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    bundlePlatform: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bundle", bundleSchema);
