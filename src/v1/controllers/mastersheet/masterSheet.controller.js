const MasterSheet = require("../../models/mastersheet.modal");

// create master sheet
exports.createMasterSheet = async (req, res) => {
  const { date, sheetId, driveFolderId } = req.body;
  try {
    const masterSheet = await MasterSheet.create({
      date,
      sheetId,
      driveFolderId,
    });
    res.status(201).json({
      status: true,
      data: masterSheet,
      message: "Master Sheet Created Successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, error, message: "Master Sheet Not Created" });
  }
};

// get all master sheet by date
exports.getMasterSheetByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const masterSheet = await MasterSheet.findOne({ date: date });
    if (masterSheet) {
      res
        .status(200)
        .json({ status: true, message: "Data Found", data: masterSheet });
    } else {
      res
        .status(200)
        .json({ status: false, message: "Data Not Found", data: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
