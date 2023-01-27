const express = require("express");
const distributorController = require("../controllers/feed/distributors");
const distributorController2 = require("../controllers/feed/distributor-controller2");
const {
  distributorValidation,
} = require("../middlewares/validators/distribute-validators");
const authValidator = require("../middlewares/validators/validation");
const distributorCreatValidation = require("../middlewares/validators/distributor/create-validation");
const distributorDeleteValidation = require("../middlewares/validators/distributor/disable-enable-validation");
const mainValidation = require("../middlewares/validators/main-validation");

const router = express.Router();

router.post(
  "/create_distributors",
  distributorValidation,
  authValidator,
  distributorCreatValidation,
  mainValidation,
  distributorController.createDistributors
);

router.post(
  "/search_distributors",
  authValidator,
  distributorController.searchDistributor
);

router.post(
  "/update_distributors",
  authValidator,
  distributorController.updateDistributor
);

router.post(
  "/getAll_distributors",
  authValidator,
  distributorController.getAllDistributors
);

router.post(
  "/get_distributors_by_pagination",
  authValidator,
  distributorController.getDistributorsByPagination
);

router.post(
  "/get_all_distributors",
  authValidator,
  distributorController.getAllDistributors
);

router.post(
  "/get_distributors_by_filters",
  authValidator,
  distributorController.getAllDistributorByFilters
);

router.post(
  "/create_distributors_csv",
  authValidator,
  distributorController.createManyDistributors
);

router.post(
  "/getAll_distributors_pageId",
  authValidator,
  distributorController.getAllDistributorsByPageId
);

router.post(
  "/getAll_distributors_ById",
  authValidator,
  distributorController.getDistributorsById
);

router.post(
  "/get_distributor_by_entityId",
  authValidator,
  distributorController.getDistributorsByEntityId
);

router.post(
  "/delete_Distributor",
  authValidator,
  distributorDeleteValidation,
  mainValidation,
  distributorController2.enableOrDisableDistributor
);

router.post(
  "/delete_distributor_from_entity",
  authValidator,
  distributorDeleteValidation,
  mainValidation,
  distributorController2.deleteDistributorFromEntity
);

module.exports = router;
