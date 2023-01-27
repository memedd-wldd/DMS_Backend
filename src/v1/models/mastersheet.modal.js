const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const masterSheetSchema = Schema({
  date: {
    type: String,
    required: true,
  },
  sheetId: {
    type: String,
    required: true,
  },
  driveFolderId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("MasterSheet", masterSheetSchema);
