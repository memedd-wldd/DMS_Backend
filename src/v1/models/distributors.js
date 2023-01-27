const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const distributorsSchema = Schema(
  {
    adminName: {
      type: String,
    },
    distributorType: {
      type: String,
    },
    phone: {
      type: String,
    },
    whatsApp: {
      type: String,
    },
    AgencyName: {
      type: String,
    },
    website: {
      type: String,
    },
    whatsAppGroup: {
      type: String,
      default: "",
    },
    email: {
      type: String,
    },
    accoutHolderName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    panNo: {
      type: String,
    },
    gstNo: {
      type: String,
    },
    upiId: {
      type: String,
    },
    branchName: {
      type: String,
    },
    accountType: {
      type: String,
    },
    ifsc: {
      type: String,
    },
    sameAsPhone: {
      type: Boolean,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: {
      type: String,
    },
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
    commercials: [
      {
        type: Schema.Types.ObjectId,
        ref: "Commercial",
      },
    ],
    entityWithCommercials: [
      {
        type: Schema.Types.ObjectId, // only entities that have commercials added to distributors
        ref: "Entity",
      },
    ],
    entity: [
      {
        type: Schema.Types.ObjectId, // only connected entities with distributor
        ref: "Entity",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

distributorsSchema.index({ adminName: "text" });

module.exports = mongoose.model("Distributor", distributorsSchema);
