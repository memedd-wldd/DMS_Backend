const Bundle = require("../../models/bundle.model");
const mongoose = require("mongoose");
const {
  selectPopulateService,
} = require("../../services/selectPopulateService");
const { newBundleCreated } = require("../../lib/emailNotification");
const { sendMail } = require("../../helpers/sendmail");

exports.createBundle = async (req, res, next) => {
  try {
    let body = req.body;
    // check if bundle name already exists if yes then return error
    body.bundleName = body.bundleName.toLowerCase();

    let bundleName = body.bundleName.toLowerCase();

    const alreadyExists = await Bundle.findOne({
      bundleName,
    });
    if (alreadyExists) {
      return res.status(400).json({
        status: false,
        message: "Bundle name already exists",
        data: null,
      });
    }

    const bundle = await Bundle.create(body);

    if (bundle) {
      const mailObject = newBundleCreated(bundle.bundleName, bundle.platform);

      const mail = await sendMail(
        mailObject.audience,
        mailObject.subject,
        "",
        mailObject.body
      );

      res.status(200).json({
        status: true,
        message: "Bundle created successfully",
        data: bundle,
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Bundle not created",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// update bundle by id
exports.updateBundleById = async (req, res, next) => {
  try {
    console.log(req.params);
    const id = req.params.id;
    const bundle = await Bundle.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      status: true,
      message: "Bundle updated successfully",
      data: bundle,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// update draft bundle to active bundle
exports.updateBundleToArchived = async (req, res, next) => {
  try {
    const { id } = req.body;
    const bundle = await Bundle.findByIdAndUpdate(id, {
      status: "draft",
    });
    res.status(200).json({
      status: "success",
      data: bundle,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// update multiple active bundle to draft bundle by ids
exports.updateMultipleBundlesToDraft = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const bundles = await Bundle.find({
      _id: { $in: ids },
      status: "active",

      isArchived: false,
    }).populate({
      path: "pages",
      populate: {
        path: "pagePlatforms",
        populate: {
          path: "platform",
        },
      },
    });
    await Bundle.updateMany({ _id: { $in: ids } }, { status: "draft" });
    res.status(200).json({
      status: "success",
      data: bundles,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// update active bundle to draft bundle
exports.updateBundleToActive = async (req, res, next) => {
  try {
    const { id } = req.body;
    const bundle = await Bundle.findByIdAndUpdate(id, {
      status: "active",
    });
    res.status(200).json({
      status: "success",
      data: bundle,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// update archived bundle to active bundle
exports.updateBundleArchivedToActive = async (req, res, next) => {
  try {
    const { ids } = req.body;
    ids.map((id) => {
      return mongoose.Types.ObjectId(id);
    });

    const bundle = await Bundle.find({
      _id: { $in: ids },
    });

    await Bundle.updateMany({ _id: { $in: ids } }, { isArchived: false });

    res.status(200).json({
      status: "Updated successfully",
      data: bundle,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// update active bundle to archived bundle
exports.updateBundleActiveToArchived = async (req, res, next) => {
  try {
    const { ids } = req.body;

    ids.map((id) => {
      return mongoose.Types.ObjectId(id);
    });

    const bundle = await Bundle.find({
      _id: { $in: ids },
    });

    await Bundle.updateMany(
      { _id: { $in: ids } },
      { isArchived: true, archivedDate: Date.now() }
    );

    res.status(200).json({
      status: "Updated successfully",
      data: bundle,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get all bundles  with pagination
exports.getAllExistingBundles = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;
    const bundles = await Bundle.find({ isArchived: false })
      .populate({
        path: "pages",
        populate: {
          path: "entity",
          populate: {
            path: "primaryCommercial",
          },
        },
      })
      .populate({
        path: "pages",
        populate: {
          path: "entity",
          populate: {
            path: "primaryDistributor",
          },
        },
      })
      .populate("createdBy")
      .skip(skip)
      .limit(limit);

    const docLength = await Bundle.find({ isArchived: false }).count();

    res.status(200).json({
      status: true,
      message: "Bundles fetched successfully",
      data: { bundles, docLength },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      message: error.message,
    });
  }
};

// get all bundles  with pagination
exports.getAllArchivedBundles = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;
    const bundles = await Bundle.find({ isArchived: true })
      .populate({
        path: "pages",
        populate: {
          path: "entity",
          populate: {
            path: "primaryCommercial",
          },
        },
      })
      .populate({
        path: "pages",
        populate: {
          path: "entity",
          populate: {
            path: "primaryDistributor",
          },
        },
      })
      .populate("createdBy")
      .skip(skip)
      .limit(limit);

    const docLength = await Bundle.find({ isArchived: true }).count();

    res.status(200).json({
      status: true,
      message: "Bundles fetched successfully",
      data: { bundles, docLength },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      message: error.message,
    });
  }
};

// get all active bundles
exports.getAllActiveBundles = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;
    const bundles = await Bundle.find({
      status: "active",
      isArchived: false,
    })
      .populate({
        path: "pages",
        populate: {
          path: "entity",
          populate: {
            path: "primaryCommercial",
          },
        },
      })
      .populate({
        path: "pages",
        populate: {
          path: "entity",
          populate: {
            path: "primaryDistributor",
          },
        },
      })

      .populate("createdBy")
      .skip(skip)
      .limit(limit);

    const docLength = await Bundle.find({
      status: "active",
      isArchived: false,
    }).count();

    res.status(200).json({
      status: true,
      message: "Bundles fetched successfully",
      data: { bundles, docLength },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      message: error.message,
    });
  }
};

// get bundle by id
exports.getBundleById = async (req, res, next) => {
  try {
    const { id } = req.body;
    const bundle = await Bundle.findById(id)
      .populate({
        path: "pages",
        populate: {
          path: "entity",
          populate: {
            path: "primaryCommercial",
          },
        },
      })
      .populate({
        path: "pages",
        populate: {
          path: "entity",
          populate: {
            path: "primaryDistributor",
          },
        },
      })
      .populate("createdBy");
    res.status(200).json({
      status: true,
      message: "Bundle fetched successfully",
      data: bundle,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      message: error.message,
    });
  }
};

// get multiple bundles by id
exports.getMultipleBundlesById = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // cast to object id
    ids.map((id) => {
      return mongoose.Types.ObjectId(id);
    });

    const bundles = await Bundle.find({ _id: { $in: ids } }).populate([
      {
        path: "pages",
        select: selectPopulateService.pagePopulate.negativeSelect,
        populate: {
          path: "entity",
          select: selectPopulateService.entityPopulate.negativeSelect,
          populate: [
            {
              path: "primaryCommercial",
              select:
                selectPopulateService.primaryCommercialPopulate.negativeSelect,
            },
            {
              path: "primaryDistributor",
              select:
                selectPopulateService.primaryDistributorPopulate.negativeSelect,
            },
          ],
        },
      },
      {
        path: "createdBy",
        select: selectPopulateService.userPopulate.select,
      },
    ]);
    res.status(200).json({
      status: true,
      message: "Bundles fetched successfully",
      data: bundles,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      message: error.message,
    });
  }
};

// get all bundles with name and id
exports.getAllBundles = async (req, res, next) => {
  try {
    const bundles = await Bundle.find({
      isArchived: false,
      status: "active",
    }).select("_id bundleName");

    if (bundles.length > 0) {
      res.status(200).json({
        status: true,
        message: "Bundles fetched successfully",
        data: bundles,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "No bundles found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// get all bundle by status and archived and platform with pagination
exports.getAllBundlesByStatusAndArchived = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;
    const { status, isArchived, platform } = req.body;
    const query = {};
    query.isArchived = isArchived;
    if (status) {
      query.status = status;
    }

    if (platform) {
      let platformName = platform;
      query.bundlePlatform = platformName;
    }

    console.log(query);

    const bundles = await Bundle.find(query)
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "pages",
          populate: {
            path: "entity",
            populate: {
              path: "primaryCommercial",
            },
          },
        },
        {
          path: "createdBy",
          select: selectPopulateService.userPopulate.select,
        },
      ]);

    const docLength = await Bundle.find(query).count();

    res.status(200).json({
      status: true,
      message: "Bundles fetched successfully",
      data: { bundles, docLength },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
