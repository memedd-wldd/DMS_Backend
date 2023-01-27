const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dropDownSchema = new Schema(
  {
    tag: [String],
    inActiveReason: [String],
    category: [String],
    city:[String], 
    language:[String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DropDown", dropDownSchema);
