const express = require("express");
const commercialsController = require("../controllers/feed/commercials");
const authValidator = require("../middlewares/validators/validation");

const router = express.Router();

router.post(
  "/create_commercials",
  authValidator,
  commercialsController.createCommercials
);

router.post(
  "/update_commercials",
  authValidator,
  commercialsController.updateCommercials
);

router.post(
  "/getCommercials_entity_byId",
  authValidator,
  commercialsController.getCommercialsByEntityId
);

router.post(
  "/add_commercials",
  authValidator,
  commercialsController.addCostingToDistributors
);

router.post(
  "/onboarded_distributors",
  authValidator,
  commercialsController.getOnboardDistributors
);

module.exports = router;
