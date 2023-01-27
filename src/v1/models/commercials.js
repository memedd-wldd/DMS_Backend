const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commercialSchema = new Schema(
  {
    entityId: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
    },
    distributorId: {
      type: Schema.Types.ObjectId,
      ref: "Distributor",
    },
    onboarding: [Object],
    costing: [Object],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Commercial", commercialSchema);
