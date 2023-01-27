const express = require("express");
const authValidator = require("../middlewares/validators/validation");
const postingTracker = require("../controllers/postingTracker/postingTracker.controller");

const router = express.Router();

// router.get("/get_posting_tracker_campaign_id", (req, res) => );

// create posting tracker
router.post(
  "/create_posting_tracker",
  authValidator,
  postingTracker.createPostingTracker
);

router.get(
  "/get_posting_tracker_by_campaign_id/:campaignId",
  authValidator,
  postingTracker.getPostingTrackerByCampaignId
);

router.post(
  "/update_posting_tracker_by_id/:id",
  authValidator,
  postingTracker.updatePostingTrackerById
);

router.get(
  "/get_posting_tracker_by_id/:id",
  authValidator,
  postingTracker.findPostingTrackerById
);

router.post(
  "/update_posting_data_from_api/:id",
  authValidator,
  postingTracker.updatePostingDataFromApi
);

module.exports = router;
