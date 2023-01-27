const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = Schema(
  {
    roleName: {
      type: String,
      required: true,
    },
    // W - read Write both
    screenRestriction: [
      {
        sectionName: {
          type: String,
        },
        access: {
          type: String,
          default: "W",
        },
      },
    ],
    // n-not shown to the user
    // r - Only has the read access
    fieldRestriction: [
      {
        collectionName: String,
        fields: [
          {
            fieldName: String,
            accessType: {
              type: String,
              default: "n",
            },
          },
        ],
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

module.exports = mongoose.model("Role", roleSchema);
