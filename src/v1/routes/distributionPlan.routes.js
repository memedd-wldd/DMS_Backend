const express = require("express");
const authValidator = require("../middlewares/validators/validation");
const distributionController = require("../controllers/distribution/distribution.controller");
const router = express.Router();

router.post(
  "/create_distribution_plan",
  authValidator,
  distributionController.createDistributionPlan
);

router.post(
  "/update_distribution_plan",
  authValidator,
  distributionController.updateDistributionPlanById
);

router.post(
  "/get_distribution_plan_by_id",
  authValidator,
  distributionController.getDistributionPlanById
);



module.exports = router;
