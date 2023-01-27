const Role = require("../../models/roles");
const Page = require("../../models/pages");
const Distributor = require("../../models/distributors");
const User = require("../../models/user");
const PageValidation = require("../../lib/pageValidation");
const FieldValidation = require("../../lib/fieldValidation");
const Entity = require("../../models/entities");
const error = require("../../helpers/errormsg");
const Objdiff = require("deep-object-diff");
const AuditLog = require("../../models/audit-log");
const pages = require("../../models/pages");
const { pageActive, pageInActive } = require("../../lib/emailNotification");
const { sendMail } = require("../../helpers/sendmail");

exports.searchPage = async (req, res, next) => {
  try {
    const { pageName, poc, distributor, global } = req.body;

    let queries = {};
    if (global && poc === null && distributor === null && pageName === null) {
      const searchedDistributor = await Distributor.find({
        adminName: { $regex: global, $options: "i" },
      })
        .populate("entity")
        .limit(30);

      const user = await User.find({ name: { $regex: global, $options: "i" } })
        .select("-password")
        .populate("pages")
        .limit(30);

      const page = await Page.find({
        pageName: { $regex: global, $options: "i" },
      })
        .populate("entity")
        .limit(30);

      res.status(200).json({
        status: true,
        message: "Success",
        data: {
          searchedDistributor,
          user,
          page,
        },
      });
    }
    if (poc === "true") {
      const AllData = [];
      const user = await User.find({
        name: { $regex: global, $options: "gi" },
      })
        .select("-password -expTime")
        .populate("pages")
        .limit(30);

      user.map((ele) => {
        let data = {
          pocName: ele.name,
          userName: ele.userName,
        };
        if (ele.pages.length !== 0) {
          ele.pages.map((page) => {
            data.pageName = page.pageName;
            data.platform = page.platform;
            data.pageId = page._id;
            data.pageEntity = page.entity;
          });
        }
        if (data.pageId || data.pageEntity) {
          AllData.push(data);
        }
      });

      if (user.length !== 0) {
        res.status(200).json({
          status: true,
          message: "Success",
          data: AllData,
        });
      } else {
        error(200, "user not found");
      }
    } else if (distributor === "true") {
      const searchedDistributor = await Distributor.find({
        adminName: { $regex: global, $options: "gi" },
      })
        .limit(10)
        .populate({
          path: "entity",
          populate: [
            {
              path: "pages",
              populate: [{ path: "wlddPoc" }],
            },
          ],
        });

      const AllData = [];

      searchedDistributor.map((ele) => {
        let data = {};
        data.distributorName = ele.adminName;
        data.agencyName = ele.AgencyName;
        ele.entity.map((element) => {
          data.pageEntity = element._id;
          element.pages.map((pageEle) => {
            data.pageId = pageEle._id;
            data.platform = pageEle.platform;
            data.pageName = pageEle.pageName;
            (data.pocName = pageEle.wlddPoc.name),
              (data.userName = pageEle.wlddPoc.userName);
          });
        });
        if (data.pageId || data.pageEntity) {
          AllData.push(data);
        }
      });

      if (searchedDistributor.length !== 0) {
        res.status(200).json({
          status: true,
          message: "Success",
          data: AllData,
        });
      } else {
        error(406, "Not found");
      }
    } else if (pageName === "true") {
      let page = [];
      page = await Page.find({
        // global search for pageName
        pageName: { $regex: global, $options: "gi" },
        isDeleted: false,
      })
        .populate("entity wlddPoc")
        .limit(30);

      console.log(page);

      // search page by page handle
      if (page.length === 0) {
        console.log("page handle");
        page = await Page.find({
          pageHandle: { $regex: global, $options: "gi" },
          isDeleted: false,
        })
          .populate("entity wlddPoc")
          .limit(30);
      }

      let AllData = [];
      page.map((ele) => {
        let data = {
          platform: ele.platform,
          pageName: ele.pageName,
          pageId: ele._id,
          pageEntity: ele.entity._id,
        };
        if (ele.wlddPoc) {
          data.pocName = ele.wlddPoc.name;
          data.userName = ele.wlddPoc.userName;
        }
        if (data.pageId || data.pageEntity) {
          AllData.push(data);
        }
      });

      console.log("AllData", AllData);

      if (page.length !== 0) {
        res.status(200).json({
          status: true,
          message: "Success",
          data: AllData,
        });
      } else {
        error(406, "Not found");
      }
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.connectDistributorAndEntity = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { entityId, distributorId } = req.body;
    let updatedPage;
    if (entityId) {
      const entity = await Entity.findById(entityId);
      let entityDistributor = entity.distributors;

      if (entityDistributor.length === 0) {
        entity.primaryDistributor = distributorId;
      }

      if (entityDistributor.indexOf(distributorId) === -1) {
        entityDistributor.push(distributorId);
        entity.distributors = entityDistributor;
        updatedPage = await entity.save();
      } else {
        return res.status(500).json({
          status: false,
          message: "Already connected",
          data: "",
        });
      }
    }

    // audit log section
    const editingUser = await User.findById(userId);

    let audit_log = {
      userName: editingUser.userName,
      userId: userId,
      entityId: entityId,
      previousData: {},
      updatedData: {},
      operation: "Added Distributor",
      changeData: {
        collection: "distributor",
      },
    };

    const auditLog = await AuditLog.create(audit_log);

    if (distributorId) {
      const distributor = await Distributor.findById(distributorId);
      let distributorEntity = distributor.entity;
      if (distributorEntity.indexOf(entityId) === -1) {
        distributorEntity.push(entityId);
        distributor.entity = distributorEntity;
        const updatedDistributor = await distributor.save();
      }
    }
    res.status(200).json({
      status: true,
      message: "connected",
      data: updatedPage,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.platformEntityWise = async (req, res, next) => {
  try {
    const { entityId } = req.body;
    const entity = await Entity.findOne({ _id: entityId }).populate("pages");
    if (entity) {
      const pageNameArray = entity.pages;
      const platform = [];
      pageNameArray.map(async (ele) => {
        platform.push(ele.platform);
      });
      res.status(200).json({
        status: true,
        message: "Success",
        data: platform,
      });
    } else {
      error(501, "Don't have any platforms");
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPageEntityId = async (req, res, next) => {
  try {
    const { entityId } = req.body;
    const entity = await Entity.findById(entityId).populate({
      path: "pages",
      match: { isDeleted: false },
    });
    if (entity) {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: entity,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Not found",
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

exports.connectDistributorAndPage = async (req, res, next) => {
  try {
    const { pageId, distributorId } = req.body;
    if (pageId) {
      const page = await Page.findById(pageId);
      let pageDistributor = page.distributors;

      if (pageDistributor.indexOf(distributorId) === -1) {
        pageDistributor.push(distributorId);
        page.distributors = pageDistributor;
        const updatedPage = await page.save();
      } else {
        return res.status(500).json({
          status: false,
          message: "Already connected",
          data: "",
        });
      }
    }
    if (distributorId) {
      const distributor = await Distributor.findById(distributorId);
      const distributorPage = distributor.pages;
      if (distributorPage.indexOf(pageId) === -1) {
        distributorPage.push(pageId);
        distributor.pages = distributorPage;
        const updatedDistributor = await distributor.save();
      }
    }
    res.status(200).json({
      status: true,
      message: "connected",
      data: "",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatedPages = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      id,
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
      pageIndex,
      eng,
      subscribers,
      avgReach,
      entity,
      comment,
      city,
      pageLanguage,
      modifiedBy,
      contentProduction,
    } = req.body;

    const beforeUpdatedPage = await Page.findById(id).select(
      "-_id -isBlocked -distributors -commercials -isDeleted -createdAt -updatedAt -__v -entity"
    );
    const oldWlddPoc = beforeUpdatedPage.wlddPoc;
    if (!beforeUpdatedPage) {
      res.status(501).json({
        status: false,
        message: "page not found",
        data: "",
      });
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
    if (pageIndex) {
      body.pageIndex = pageIndex;
    }
    if (eng) {
      body.eng = eng;
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
    if (city) {
      body.city = city;
    }
    if (pageLanguage) {
      body.pageLanguage = pageLanguage;
    }

    if (modifiedBy) {
      body.modifiedBy = modifiedBy;
    }

    if (contentProduction) {
      body.contentProduction = contentProduction;
    }

    // Poc change
    const user = await User.findById(wlddPoc);

    if (user) {
      let userAssociatePages = user.pages;

      if (userAssociatePages.indexOf(id) === -1) {
        userAssociatePages.push(id);
        user.pages = userAssociatePages;
        const updatedUser = await user.save();
        const oldUser = await User.findById(oldWlddPoc);
        const oldUserPages = oldUser.pages;
        oldUserPages.remove(id);
        oldUser.pages = oldUserPages;
        const updatedOldUser = await oldUser.save();
      }
    } else {
      return res.status(200).json({
        status: false,
        message: "user not found",
        data: "",
      });
    }
    // audit Log
    const editUser = await User.findById(userId).select("userName");

    const previousData = {
      ...beforeUpdatedPage._doc,
      wlddPoc: String(beforeUpdatedPage.wlddPoc),
    };

    //console.log(previousData);
    const updatedData = {
      ...body,
    };

    //console.log(updatedData);
    let changeData = Objdiff.detailedDiff(previousData, updatedData);
    //console.log(changeData);

    if (previousData.wlddPoc !== updatedData.wlddPoc) {
      changeData = {
        ...changeData,
        pocName: user.userName,
      };
    }

    if (previousData.pageStatus !== updatedData.pageStatus) {
      if (updatedData.pageStatus === "active") {
        const mailObject = pageActive(
          updatedData.link,
          updatedData.pageName,
          updatedData.platform,
          user.name
        );

        const mail = await sendMail(
          mailObject.audience,
          mailObject.subject,
          "",
          mailObject.body
        );

        if (!mail) {
          return res.status(200).json({
            status: false,
            message: "Mail not sent, please try again",
            data: null,
          });
        }
      } else {
        const mailObject = pageInActive(
          updatedData.link,
          updatedData.pageName,
          updatedData.platform,
          user.name
        );
        const mail = await sendMail(
          mailObject.audience,
          mailObject.subject,
          "",
          mailObject.body
        );

        if (!mail) {
          return res.status(200).json({
            status: false,
            message: "Mail not sent, please try again",
            data: null,
          });
        }
      }
    }

    const audit_body = {
      userName: editUser.userName,
      userId: userId,
      entityId: entity,
      previousData: previousData,
      updatedData: updatedData,
      operation: "Update",
      changeData: { changeData, collection: "page" },
    };

    //console.log(audit_body);

    const auditLog = await AuditLog.create(audit_body);

    // updating page
    const updatePage = await Page.findByIdAndUpdate(id, body, { new: true });

    if (updatePage) {
      return res.status(200).json({
        status: true,
        message: "Updated",
        data: updatePage,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Failed",
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
