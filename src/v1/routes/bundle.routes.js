const express = require("express");

const authValidator = require("../middlewares/validators/validation");
const bundleController = require("../controllers/bundle/bundle.controller");

const router = express.Router();

router.post("/create_bundle", authValidator, bundleController.createBundle);

router.post(
  "/edit_bundle/:id",
  authValidator,
  bundleController.updateBundleById
);

router.get(
  "/get_existing_bundle",
  authValidator,
  bundleController.getAllExistingBundles
);

router.get(
  "/get_archived_bundle",
  authValidator,
  bundleController.getAllArchivedBundles
);

router.get(
  "/get_active_bundle",
  authValidator,
  bundleController.getAllActiveBundles
);

router.get(
  "/get_all_active_bundles_short",
  authValidator,
  bundleController.getAllBundles
);

router.post("/get_bundle_by_id", authValidator, bundleController.getBundleById);

router.post(
  "/get_multiple_bundles_by_ids",
  authValidator,
  bundleController.getMultipleBundlesById
);

router.post("/update_bundle", authValidator, bundleController.updateBundleById);

router.post(
  "/get_all_bundles_by_filter",
  authValidator,
  bundleController.getAllBundlesByStatusAndArchived
);

router.post(
  "/update_to_archived_bundle",
  authValidator,
  bundleController.updateBundleActiveToArchived
);

router.post(
  "/update_to_active_bundle",
  authValidator,
  bundleController.updateBundleArchivedToActive
);

module.exports = router;
