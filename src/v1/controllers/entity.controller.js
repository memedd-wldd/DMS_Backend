const Entity = require("../models/entities");
const Commercial = require("../models/commercials");

// get entity details by id
exports.getEntityById = async (req, res, next) => {
  try {
    const entityId = req.params.id;
    const entity = await Entity.findById(entityId);
    if (entity) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: entity,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed",
        data: {},
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// change entity primary distributor
exports.changeEntityPrimaryDistributor = async (req, res, next) => {
  try {
    const entityId = req.params.id;
    const entity = await Entity.findById(entityId);
    const { distributorId } = req.body;
    const commercialDetails = await Commercial.find({
      distributorId: distributorId,
      entityId: entityId,
    });
    let commercialId = null;
    console.log(commercialDetails);
    if (commercialDetails.length > 0) {
      commercialId = commercialDetails[0]._id;
    }
    if (entity) {
      entity.primaryDistributor = distributorId;
      entity.primaryCommercial = commercialId;
      await entity.save();
      res.status(200).json({
        status: true,
        message: "Primary Distributor Changes Successfully",
        data: entity,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "update failed",
        data: {},
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// change entity primary commercial
exports.changeEntityPrimaryCommercial = async (req, res, next) => {
  try {
    const entityId = req.params.id;
    const entity = await Entity.findById(entityId);
    if (entity) {
      entity.primaryCommercial = req.body.primaryCommercial;
      await entity.save();
      res.status(200).json({
        status: true,
        message: "Success",
        data: entity,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed",
        data: {},
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
