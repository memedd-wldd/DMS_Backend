// create posting tracker controller
const mongoose = require("mongoose");
const axios = require("axios");

const PostingTracker = require("../../models/postingTracker.model");
const auditLogCampaign = require("../../models/audit-log-campaign");
const DistributionPlan = require("../../models/distributionPlan.modal");
const Queue = require("../../models/queue.modal");
const {
  selectPopulateService,
} = require("../../services/selectPopulateService");

const io = require("../../../../app");

let updating = false;

exports.createPostingTracker = async (req, res, next) => {
  try {
    const data = req.body;
    // if campaign is present any of the posting tracker data

    if (!data.campaign) {
      res.status(400).json({
        status: false,
        message: "Provide a campaign ID",
        data: campaign,
      });
    }

    const campaign = await PostingTracker.findOne({
      campaign: mongoose.Types.ObjectId(data.campaign),
    });

    if (campaign) {
      res.status(400).json({
        status: false,
        message:
          "Database have multiple posting tracker with the same campaign",
        data: campaign,
      });
    }

    if (campaign) {
      res.status(200).json({
        status: false,
        message: "Posting Tracker Already Exist",
        data: campaign,
      });
    } else {
      const distribution = await DistributionPlan.findById(
        data.distributionPlan
      );
      if (distribution) {
        const postingTracker = await PostingTracker.create(data);
        if (postingTracker) {
          const distributionPlan = await DistributionPlan.findByIdAndUpdate(
            data.distributionPlan,
            {
              postingTracker: postingTracker._id,
            }
          );
          if (distributionPlan) {
            let audit_body = {
              userId: data.createdBy,
              campaignId: data.campaign,
              previousData: {},
              updatedData: {},
              operation: "Posting Tracker Created",
              changeData: { collection: "postingTracker" },
            };
            const audit_log = await auditLogCampaign.create(audit_body);

            res.status(200).json({
              status: true,
              message: "Posting Tracker Created",
              data: postingTracker,
            });
          } else {
            res.status(500).json({
              status: false,
              message: "Distribution Plan Not Found",
              data: postingTracker,
            });
          }
        } else {
          res.status(404).json({
            status: "failed",
            message: "failed",
            data: [],
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "Distribution Plan Not Found",
          data: [],
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// update posting tracker by id
exports.updatePostingTrackerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({
        status: false,
        message: "Provide a id",
        data: [],
      });
    }

    const postingTracker = await PostingTracker.findByIdAndUpdate(id, req.body);
    if (postingTracker) {
      if (!req.body.audit) {
        const audit_body = {
          userId: req.body.updatedBy,
          campaignId: req.body.campaign,
          previousData: {},
          updatedData: {},
          operation: "Posting tracker Updated",
          changeData: { collection: "postingTracker" },
        };

        // tracking the data in audit log
        const audit_log = await auditLogCampaign.create(audit_body);
      }
      res.status(200).json({
        status: true,
        message: "Posting Tracker Updated",
        data: postingTracker,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "Posting Tracker Not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get posting tracker by campaign id
exports.getPostingTrackerByCampaignId = async (req, res, next) => {
  try {
    const campaignId = req.params.campaignId;
    const postingTracker = await PostingTracker.find({ campaign: campaignId });
    if (postingTracker) {
      res.status(200).json({
        status: true,
        message: "Posting Tracker Found",
        data: postingTracker,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "failed",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.findPostingTrackerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({
        status: false,
        message: "Provide a id",
        data: [],
      });
    }
    const postingTracker = await PostingTracker.findById(id).populate([
      {
        path: "campaign",
      },
      {
        path: "pages",
        populate: [
          {
            path: "distributor",
            select:
              selectPopulateService.primaryDistributorPopulate.negativeSelect,
          },
          {
            path: "commercial",
            select:
              selectPopulateService.primaryCommercialPopulate.negativeSelect,
          },
          {
            path: "user",
            select: selectPopulateService.userPopulate.select,
          },
        ],
      },
    ]);
    if (postingTracker) {
      res.status(200).json({
        status: true,
        message: "Posting Tracker Found",
        data: postingTracker,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Posting Tracker id not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updatePostingDataFromApi = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({
        status: false,
        message: "Provide a id",
        data: [],
      });
    }

    let data = {
      dataUpdating: true,
    };

    // update the dataUpdating key to true
    const postingTracker = await PostingTracker.findByIdAndUpdate(
      id,
      data
    ).lean();

    // add query to the queue model
    const queue = await Queue.create({
      postingTrackerId: id,
    });

    if (postingTracker) {
      if (!updating) {
        this.updateDataFromQueue();
      }
      res.status(200).json({
        status: true,
        message: "Posting Tracker Data Updating",
        data: { ...postingTracker, dataUpdating: true },
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Posting Tracker id not found",
        data: [],
      });
    }
  } catch (error) {}
};

// get all the data from the queue  and update the data
exports.updateDataFromQueue = async () => {
  try {
    // get the all the queue data

    const allQueue = await Queue.findOne({})
      .sort({ createdAt: 1 })
      .populate([
        {
          path: "postingTrackerId",
        },
      ])
      .lean();

    if (allQueue) {
      updating = true;
      const postingTracker = allQueue.postingTrackerId;
      const id = postingTracker._id;

      // get the data from the instagram
      getDataFromInstagram(postingTracker);

      // delete the queue
      await Queue.findByIdAndDelete(allQueue._id);
    } else {
      updating = false;
      console.log("No data in the queue");
    }
  } catch (error) {
    console.log(error);
  }
};

const getDataFromInstagram = async (data) => {
  // filter all the pages which are instagram
  // const pages = data.pages.filter(
  //   (page) => page.pagePlatForm.toLowerCase() === "instagram"
  // );

  // get the ids of the post from the url
  // const postIds = pages.map((page) => {
  //   return { ...page, _id: page._id, code: page.pageURL.split("/")[4] };
  // });

  // call 1 by 1 api to get the data of the post after previous api call is completed
  let index = 0;
  getData(index, data);
};

const getData = async (index, postingDetails) => {
  let apiInfo = {
    "X-RapidAPI-Key": "d586c0e562mshd423eb6c8cd85b9p123694jsn32b84412171c",
    "X-RapidAPI-Host": "instagram188.p.rapidapi.com",
  };

  if (index < postingDetails.pages.length) {
    const postId = postingDetails.pages[index];

    if (
      postId.pagePlatForm.toLowerCase() === "instagram" &&
      ["Post", "Reel", "Promo", "Collaboration"].includes(postId.pageType) &&
      postId.pageURL
    ) {
      let code = postId.pageURL.split("/")[4];
      const options = {
        method: "GET",
        url: `https://instagram188.p.rapidapi.com/postinfo/${code}`,
        headers: apiInfo,
      };

      await axios
        .request(options)
        .then(async function (response) {
          if (response.data.success) {
            // update the page with the data
            let data = response.data.data;
            postingDetails.pages[index]["pageComments"] = data.comment_count
              ? data.comment_count
              : 0;
            postingDetails.pages[index]["pageLikes"] = data.like_count
              ? data.like_count
              : 0;
            postingDetails.pages[index]["pageViews"] = data.play_count
              ? data.play_count
              : 0;
            console.log("index", index, data);
          }
          // call the next api
          getData(index + 1, postingDetails);
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      getData(index + 1, postingDetails);
    }
  } else {
    let data = {
      ...postingDetails,
      pages: [...postingDetails.pages],
      dataUpdating: false,
    };

    const postingTracker = await PostingTracker.findByIdAndUpdate(
      postingDetails._id,
      data
    ).lean();

    io.io.to(postingDetails._id.toString()).emit("postingTracker", {
      data: {
        ...postingTracker,
        pages: [...postingDetails.pages],
        dataUpdating: false,
      },
      postingTrackerId: postingDetails._id,
    });

    this.updateDataFromQueue();
  }
};
