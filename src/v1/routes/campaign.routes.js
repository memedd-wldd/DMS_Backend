const express = require("express");

const authValidator = require("../middlewares/validators/validation");
const campaignController = require("../controllers/campaign/campaign.controller");

const router = express.Router();

router.post(
  "/create_campaign",
  authValidator,
  campaignController.createCampaign
);

router.post(
  "/edit_campaign/:id",
  authValidator,
  campaignController.editCampaign
);

router.post(
  "/delete_campaign",
  authValidator,
  campaignController.deleteCampaign
);

router.post(
  "/get_campaign_by_status",
  authValidator,
  campaignController.fetchCampaignsByStatus
);

router.get(
  "/get_campaign_list",
  authValidator,
  campaignController.fetchAllCampaign
);

router.get(
  "/get_campaign_list_by_pagination",
  authValidator,
  campaignController.fetchAllCampaignPagination
);

router.get(
  "/get_campaign_list_status_by_pagination",
  authValidator,
  campaignController.fetchCampaignsByStatusPagination
);

router.get(
  "/get_campaign_by_id/:id",
  authValidator,
  campaignController.fetchCampaignById
);

router.get("/get_all_client", authValidator, campaignController.fetchAllClient);

module.exports = router;
