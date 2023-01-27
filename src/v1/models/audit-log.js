const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditSchema = new Schema(
  {
    userName: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    entityId: {
      type: Schema.Types.ObjectId,
      ref: "Entity",
    },
    operation:{
      type:String
    },
    previousData: {
      type: Object,
    },
    updatedData: {
      type: Object,
    },
    changeData: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLog", auditSchema);
