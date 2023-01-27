const express = require("express");
const authValidator = require("../middlewares/validators/validation");
const createValidation = require("../middlewares/validators/page/create-validation");
const deleteValidation = require("../middlewares/validators/page/delete-validation");
const mainValidation = require("../middlewares/validators/main-validation");
const pageController = require("../controllers/feed/page");
const pageController2 = require("../controllers/feed/page-controllers2");
const homeController = require("../controllers/home-page");
const pageController3 = require("../controllers/feed/page-controller3");
const dropDown = require("../controllers/dropDrownController");

const router = express.Router();

router.post(
  "/page_info",
  authValidator,
  createValidation,
  mainValidation,
  pageController.createPageInfo
);

router.post("/get_all_pages", authValidator, pageController.getAllPageDetails);

// get page by filter
router.post(
  "/get_page_by_filter",
  authValidator,
  pageController.getPageDetailsByFilter
);

router.post(
  "/get_all_page_by_filter",
  authValidator,
  pageController.getAllPageDetailsFilter
);

router.post(
  "/get_new_pages_by_filter",
  authValidator,
  pageController.getNewPageDetailsByFilter
);

router.post("/search_page", authValidator, pageController2.searchPage);

router.post(
  "/page_entity_by_id",
  authValidator,
  pageController2.platformEntityWise
);

router.post("/update_page", authValidator, pageController2.updatedPages);

router.post(
  "/connect_distributor_entity",
  authValidator,
  pageController2.connectDistributorAndEntity
);

router.post(
  "/entities_with_pages",
  authValidator,
  pageController2.getPageEntityId
);

router.get("/get_home", authValidator, homeController.homePage);

router.post(
  "/delete_page",
  authValidator,
  deleteValidation,
  mainValidation,
  pageController3.deletePage
);

router.get("/get_dropdown", authValidator, dropDown.getAllDropDown);

router.post("/add_dropdown", authValidator, dropDown.addNewOptions);

router.post("/delete_dropdown", authValidator, dropDown.deleteDropdown);

router.post(
  "/get-multiple-page-by-id",
  authValidator,
  pageController.getAllPageDetailsByIds
);

router.post(
  "/update_pages_by_ids",
  authValidator,
  pageController.updatePagesByIds
);

module.exports = router;
