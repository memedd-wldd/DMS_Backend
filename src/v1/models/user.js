const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    name: String,
    userName: String,
    password: String,
    email: String,
    phoneNumber: String,
    driveFolderId: {
      type: String,
      default: "",
    },
    isBlocked: { type: Boolean, default: false },
    blockedReason: String,
    roleName: {
      type: String,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    forgetPasswordOtp: {
      type: String,
    },
    expTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ name: "text", email: "text" });

module.exports = mongoose.model("User", UserSchema);
