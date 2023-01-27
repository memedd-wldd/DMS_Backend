const Role = require("../../models/roles");
const Page = require("../../models/pages");
const User = require("../../models/user");
const PageValidation = require("../../lib/pageValidation");
const FieldValidation = require("../../lib/fieldValidation");
const error = require("../../helpers/errormsg");
const Entity = require("../../models/entities");
const mongoose = require("mongoose");
const { pageCreationPostingReady } = require("../../lib/emailNotification");
const { sendMail } = require("../../helpers/sendmail");
const {
  selectPopulateService,
} = require("../../services/selectPopulateService");

exports.createPageInfo = async (req, res, next) => {
  try {
    const {
      platform,
      pageName,
      pageStatus,
      inactiveReasons,
      pageCategory,
      pageHandle,
      tags,
      link,
      pageType,
      followers,
      avgLikes,
      avgReelViews,
      avgComments,
      wlddPoc,
      bucket,
      nextReview,
      eng,
      pageIndex,
      subscribers,
      avgReach,
      entityId,
      comment,
      city,
      pageLanguage,
      createdBy,
      contentProduction,
    } = req.body;

    // validation
    const validatePage = await Page.findOne({
      pageHandle: pageHandle,
      platform: platform.replace(/\b\w/g, (l) => l.toUpperCase()),
      isDeleted: false,
    });

    if (validatePage) {
      error(406, "Already exist");
    }

    let body = {};
    if (platform) {
      let platformName = platform;
      body.platform = platformName.replace(/\b\w/g, (l) => l.toUpperCase());
    }
    if (pageName) {
      let name = pageName;
      body.pageName = name;
    }
    if (pageStatus) {
      body.pageStatus = pageStatus;
    }
    if (inactiveReasons) {
      body.inactiveReasons = inactiveReasons;
    }
    if (pageCategory) {
      body.pageCategory = pageCategory;
    }
    if (pageHandle) {
      body.pageHandle = pageHandle;
    }
    if (tags) {
      body.tags = tags;
    }
    if (link) {
      body.link = link;
    }
    if (pageType) {
      body.pageType = pageType;
    }
    if (followers) {
      body.followers = followers;
    }
    if (avgLikes) {
      body.avgLikes = avgLikes;
    }
    if (avgReelViews) {
      body.avgReelViews = avgReelViews;
    }
    if (avgComments) {
      body.avgComments = avgComments;
    }
    if (wlddPoc) {
      body.wlddPoc = wlddPoc;
    }
    if (bucket) {
      body.bucket = bucket;
    }
    if (nextReview) {
      body.nextReview = nextReview;
    }
    if (eng) {
      body.eng = eng;
    }
    if (entityId) {
      body.entity = entityId;
    }
    if (pageIndex) {
      body.pageIndex = pageIndex;
    }
    if (subscribers) {
      body.subscribers = subscribers;
    }
    if (avgReach) {
      body.avgReach = avgReach;
    }
    if (comment) {
      body.comment = comment;
    }
    if (pageLanguage) {
      body.pageLanguage = pageLanguage;
    }
    if (city) {
      body.city = city;
    }
    if (createdBy) {
      body.createdBy = createdBy;
    }
    if (contentProduction) {
      body.contentProduction = contentProduction;
    }

    const page = await Page.create(body);
    const user = await User.findById(wlddPoc);
    if (user) {
      let userAssociatePages = user.pages;
      userAssociatePages.push(page._id);
      user.pages = userAssociatePages;
      const updatedUser = await user.save();
    } else {
      return res.status(200).json({
        status: false,
        message: "user not found",
        data: "",
      });
    }

    // when a new page is created sent a mail to the
    if (page) {
      const mailObject = pageCreationPostingReady(body.platform, body.pageName);

      const mail = await sendMail(
        mailObject.audience,
        mailObject.subject,
        "",
        mailObject.body
      );

      if (!mail) {
        return res.status(400).json({
          status: false,
          message: "Mail not sent. Something went wrong",
        });
      }
    }

    if (!entityId) {
      let pages = [],
        entity_body = {};
      pages.push(page._id);

      entity_body.pages = pages;
      const entity = await Entity.create(entity_body);

      const updatePage = await Page.findByIdAndUpdate(
        { _id: page._id },
        { entity: entity._id },
        { new: true }
      );
      //console.log(updatePage);
      return res.status(200).json({
        status: true,
        message: "success",
        data: {
          updatePage,
          entity,
        },
      });
    } else {
      const entity = await Entity.findById(entityId);
      if (entity) {
        const pageEntity = entity.pages;
        pageEntity.push(page._id);
        entity.pages = pageEntity;
        const updatedEntity = await entity.save();
      } else {
        error(501, "entity not present");
      }
      return res.status(200).json({
        status: true,
        message: "success",
        data: page,
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllPageDetails = async (req, res, next) => {
  try {
    const { skip, limit } = req.body;
    const pages = await Page.find({ isDeleted: false })
      .populate({
        path: "entity",
        select: "distributors",
        populate: [
          {
            path: "distributors",
            select: "adminName phone",
          },
        ],
      })
      .populate("createdBy")
      .populate("modifiedBy")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");
    const docLength = await Page.find({ isDeleted: false }).count();

    let data = [];

    console.log(pages[0]);
    pages.forEach((ele) => {
      if (ele) {
        let body = {};
        body._id = ele._id;
        body.pageName = ele.pageName;
        body.pageStatus = ele.pageStatus;
        body.inactiveReasons = ele.inactiveReasons;
        body.platform = ele.platform;
        body.followers = ele.followers;
        body.bucket = ele.bucket;
        body.pageCategory = ele.pageCategory;
        body.eng = ele.eng;
        body.link = ele.link;
        body.createdAt = ele.createdAt;
        body.createdBy = ele.createdBy?.userName;
        body.modifiedBy = ele.modifiedBy?.userName;
        body.modifiedAt = ele.updatedAt;

        if (ele.entity) {
          body.entityId = ele.entity._id;
          if (ele.entity.distributors.length === 0) {
            body.adminName = "";
            body.phone = "";
          } else {
            body.adminName = ele.entity.distributors[0].adminName;
            body.phone = ele.entity.distributors[0].phone;
          }
          data.push(body);
        }
      }
    });

    if (pages) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: {
          pages: data,
          docLength,
        },
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Don't have Pages",
        data: "",
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPageDetailsById = async (req, res, next) => {
  try {
    const { id } = req.body;
    const page = await Page.findById(id);

    if (page) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: page,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed",
        data: [],
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get pages by filter
exports.getPageDetailsByFilter = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;
    const {
      pageName,
      pageStatus,
      platform,
      followers,
      bucket,
      entityId,
      pageIndex,
      subscribers,
      avgLikes,
      avgReelViews,
      avgComments,
      wlddPoc,
      language,
      city,
      comment,
      tag,
      category,
      pageCategory,
      isActive,
      pageHandle,
    } = req.body;

    let query = { isDeleted: false };
    if (pageName) {
      query.pageName = {
        $regex: typeof pageName === "object" ? pageName[0] : pageName,
        $options: "gi",
      };
    }
    if (pageStatus) {
      query.posting = pageStatus;
    }

    if (isActive) {
      query.pageStatus = isActive;
    }

    if (platform) {
      if (typeof platform === "string") {
        query.platform = platform.replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        platform.forEach((ele) => {
          ele = ele.replace(/\b\w/g, (l) => l.toUpperCase());
        });
        query.platform = platform;
      }
    }

    if (followers) {
      query.followers = followers;
    }
    if (bucket) {
      query.bucket = bucket;
    }
    if (entityId) {
      query.entity = entityId;
    }
    if (pageIndex) {
      query.pageIndex = pageIndex;
    }
    if (subscribers) {
      query.subscribers = subscribers;
    }
    if (avgLikes) {
      query.avgLikes = avgLikes;
    }
    if (avgReelViews) {
      query.avgReelViews = avgReelViews;
    }
    if (avgComments) {
      query.avgComments = avgComments;
    }
    if (wlddPoc) {
      query.wlddPoc = wlddPoc;
    }
    if (language) {
      query.pageLanguage = language;
    }
    if (city) {
      query.city = city;
    }
    if (comment) {
      query.comment = comment;
    }
    if (tag) {
      query.tags = tag;
    }
    if (category) {
      query.pageCategory = category;
    }
    if (pageCategory) {
      query.pageCategory = pageCategory;
    }

    if (pageHandle) {
      query.pageHandle = {
        $regex: typeof pageHandle === "object" ? pageHandle[0] : pageHandle,
        $options: "gi",
      };
    }


    if (!query.posting) {
      console.log("Sata");
      const pages = await Page.find(query)
        .populate([
          {
            path: "entity",
            select: selectPopulateService.entityPopulate.negativeSelect,
            populate: [
              {
                path: "primaryCommercial",
                select:
                  selectPopulateService.primaryCommercialPopulate
                    .negativeSelect,
              },
              {
                path: "distributors",
                select:
                  selectPopulateService.primaryDistributorPopulate
                    .negativeSelect,
              },
              {
                path: "primaryDistributor",
                select:
                  selectPopulateService.primaryDistributorPopulate
                    .negativeSelect,
              },
            ],
          },
          {
            path: "wlddPoc",
            select: selectPopulateService.userPopulate.select,
          },
          {
            path: "modifiedBy",
            select: selectPopulateService.userPopulate.select,
          },
          {
            path: "createdBy",
            select: selectPopulateService.userPopulate.select,
          },
        ])
        .select(selectPopulateService.pagePopulate.negativeSelect)
        .skip(skip)
        .limit(limit);

      const docLength = await Page.find(query).count();

      if (pages) {
        res.status(200).json({
          status: true,
          message: "Success",
          data: {
            pages,
            docLength,
          },
        });
      } else {
        res.status(200).json({
          status: false,
          message: "No Pages Found",
          data: [],
        });
      }
    } else {
      let pages = await Page.find({ ...query })
        .populate({
          path: "entity",
          match: {
            primaryCommercial: {
              $exists: true,
            },
          },
          populate: {
            path: "primaryCommercial",
            model: "Commercial",
            match: {
              "onboarding.status": "postingReady",
            },
          },
        })
        .populate({
          path: "entity",
          match: {
            primaryDistributor: {
              $exists: true,
            },
          },
          populate: {
            path: "primaryDistributor",
            model: "Distributor",
          },
        })
        .lean();

      pages = pages.filter((ele) => ele.entity && ele.entity.primaryCommercial);

      const docLength = pages.length;

      pages.splice(0, skip);

      pages = pages.slice(0, limit);

      if (pages) {
        res.status(200).json({
          status: true,
          message: "Pages Fetched Successfully",
          data: {
            pages,
            docLength,
          },
        });
      } else {
        res.status(200).json({
          status: false,
          message: "No Pages Found",
          data: [],
        });
      }
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get new pages which created in last 30 days
exports.getNewPageDetailsByFilter = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;
    const {
      pageName,
      pageStatus,
      platform,
      followers,
      bucket,
      entityId,
      pageIndex,
      subscribers,
      avgLikes,
      avgReelViews,
      avgComments,
      wlddPoc,
      language,
      city,
      comment,
      tag,
      category,
      pageCategory,
      isActive,
      pageHandle,
    } = req.body;

    let query = { isDeleted: false };
    if (pageName) {
      query.pageName = { $regex: "^" + pageName, $options: "i" };
    }
    if (pageStatus) {
      query.posting = pageStatus;
    }

    if (isActive) {
      query.pageStatus = isActive;
    }

    if (platform) {
      if (typeof platform === "string") {
        query.platform = platform.replace(/\b\w/g, (l) => l.toUpperCase());
      } else {
        platform.forEach((ele) => {
          ele = ele.replace(/\b\w/g, (l) => l.toUpperCase());
        });
        query.platform = platform;
      }
    }

    if (followers) {
      query.followers = followers;
    }
    if (bucket) {
      query.bucket = bucket;
    }
    if (entityId) {
      query.entity = entityId;
    }
    if (pageIndex) {
      query.pageIndex = pageIndex;
    }
    if (subscribers) {
      query.subscribers = subscribers;
    }
    if (avgLikes) {
      query.avgLikes = avgLikes;
    }
    if (avgReelViews) {
      query.avgReelViews = avgReelViews;
    }
    if (avgComments) {
      query.avgComments = avgComments;
    }
    if (wlddPoc) {
      query.wlddPoc = wlddPoc;
    }
    if (language) {
      query.pageLanguage = language;
    }
    if (city) {
      query.city = city;
    }
    if (comment) {
      query.comment = comment;
    }
    if (tag) {
      query.tags = tag;
    }
    if (category) {
      query.pageCategory = category;
    }
    if (pageCategory) {
      query.pageCategory = pageCategory;
    }

    if (pageHandle) {
      query.pageHandle = { $regex: "^" + pageHandle, $options: "i" };
    }
    const pages = await Page.find({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
      ...query,
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "entity",
          select: selectPopulateService.entityPopulate.negativeSelect,
          populate: [
            {
              path: "primaryCommercial",
              select:
                selectPopulateService.primaryCommercialPopulate.negativeSelect,
            },
            {
              path: "distributors",
              select:
                selectPopulateService.primaryDistributorPopulate.negativeSelect,
            },
            {
              path: "primaryDistributor",
              select:
                selectPopulateService.primaryDistributorPopulate.negativeSelect,
            },
          ],
        },
        {
          path: "wlddPoc",
          select: selectPopulateService.userPopulate.select,
        },
        {
          path: "modifiedBy",
          select: selectPopulateService.userPopulate.select,
        },
        {
          path: "createdBy",
          select: selectPopulateService.userPopulate.select,
        },
      ])
      .select(selectPopulateService.pagePopulate.negativeSelect)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const docLength = await Page.find({
      isDeleted: false,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
      ...query,
    }).count();

    if (pages) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: {
          pages,
          docLength,
        },
      });
    } else {
      res.status(200).json({
        status: false,
        message: "No Pages Found",
        data: [],
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllPageDetailsFilter = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;
    const {
      pageName,
      pageStatus,
      platform,
      followers,
      bucket,
      entityId,
      pageIndex,
      subscribers,
      avgLikes,
      avgReelViews,
      avgComments,
      wlddPoc,
      language,
      city,
      pageCategory,
      comment,
      tag,
    } = req.body;

    let query = { isDeleted: false };
    if (pageName) {
      query.pageName = { $regex: "^" + pageName, $options: "i" };
    }
    if (pageStatus) {
      query.pageStatus = pageStatus;
    }
    if (platform) {
      platform.forEach((ele) => {
        ele = ele.replace(/\b\w/g, (l) => l.toUpperCase());
      });
      query.platform = platform;
    }
    if (followers) {
      query.followers = followers;
    }
    if (bucket) {
      query.bucket = bucket;
    }
    if (entityId) {
      query.entity = entityId;
    }
    if (pageIndex) {
      query.pageIndex = pageIndex;
    }
    if (subscribers) {
      query.subscribers = subscribers;
    }
    if (avgLikes) {
      query.avgLikes = avgLikes;
    }
    if (avgReelViews) {
      query.avgReelViews = avgReelViews;
    }
    if (avgComments) {
      query.avgComments = avgComments;
    }
    if (wlddPoc) {
      query.wlddPoc = wlddPoc;
    }
    if (language) {
      query.pageLanguage = language;
    }
    if (city) {
      query.city = city;
    }
    if (comment) {
      query.comment = comment;
    }

    if (pageCategory) {
      query.pageCategory = pageCategory;
    }
    if (tag) {
      query.tags = tag;
    }
    console.log(query);

    const pages = await Page.find(query)
      .populate({
        path: "entity",
        select: "distributors",
        populate: [
          {
            path: "distributors",
            select: "adminName phone",
          },
        ],
      })
      .populate("createdBy")
      .populate("modifiedBy")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");
    const docLength = await Page.find(query).count();

    let data = [];

    console.log(pages[0]);
    pages.forEach((ele) => {
      if (ele) {
        let body = {};
        body._id = ele._id;
        body.pageName = ele.pageName;
        body.pageStatus = ele.pageStatus;
        body.inactiveReasons = ele.inactiveReasons;
        body.platform = ele.platform;
        body.followers = ele.followers;
        body.bucket = ele.bucket;
        body.pageCategory = ele.pageCategory;
        body.eng = ele.eng;
        body.link = ele.link;
        body.createdAt = ele.createdAt;
        body.createdBy = ele.createdBy?.userName;
        body.modifiedBy = ele.modifiedBy?.userName;
        body.modifiedAt = ele.updatedAt;

        if (ele.entity) {
          body.entityId = ele.entity._id;
          if (ele.entity.distributors.length === 0) {
            body.adminName = "";
            body.phone = "";
          } else {
            body.adminName = ele.entity.distributors[0].adminName;
            body.phone = ele.entity.distributors[0].phone;
          }
          data.push(body);
        }
      }
    });

    if (pages) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: {
          pages: data,
          docLength,
        },
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Don't have Pages",
        data: "",
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// get all the pages by ids
exports.getAllPageDetailsByIds = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // cast the ids to mongoose objectId type
    const idsArray = ids.map((id) => mongoose.Types.ObjectId(id));

    const pages = await Page.find({ _id: { $in: idsArray } })
      .populate({
        path: "entity",
        select: selectPopulateService.entityPopulate.negativeSelect,
        populate: [
          {
            path: "primaryCommercial",
            select:
              selectPopulateService.primaryCommercialPopulate.negativeSelect,
          },
        ],
      })
      .select(selectPopulateService.pagePopulate.negativeSelect);
    if (pages) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: pages,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "No Pages Found",
        data: [],
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePagesByIds = async (req, res, next) => {
  try {
    // bulkWrite is used to update multiple documents at once
    const { updateData } = req.body;
    const idsArray = updateData.map((ele) => mongoose.Types.ObjectId(ele._id));
    const pages = await Page.bulkWrite(
      idsArray.map((id) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { ...updateData.find((ele) => ele._id == id) } },
        },
      }))
    );
    if (pages) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: pages,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "No Pages Found",
        data: [],
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
