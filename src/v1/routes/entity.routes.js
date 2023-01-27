const express = require("express");
const {
  getEntityById,
  changeEntityPrimaryDistributor,
} = require("../controllers/entity.controller");

const authValidator = require("../middlewares/validators/validation");

const router = express.Router();

router.get("/get_entity_details/:id", authValidator, getEntityById);
router.post(
  "/change_entity_primary_distributor/:id",
  authValidator,
  changeEntityPrimaryDistributor
);

module.exports = router;
