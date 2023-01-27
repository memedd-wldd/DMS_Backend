const express = require("express");

const router = express.Router();

const masterSheetController = require("../controllers/mastersheet/masterSheet.controller");

const authValidator = require("../middlewares/validators/validation");

router.post(
  "/create_master_sheet",
  authValidator,
  masterSheetController.createMasterSheet
);

router.get(
  "/get_master_sheet_by_date/:date",
  authValidator,
  masterSheetController.getMasterSheetByDate
);


module.exports = router;