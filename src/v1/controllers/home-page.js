const User = require("../models/user");
const { selectPopulateService } = require("../services/selectPopulateService");

exports.homePage = async (req, res, next) => {
  try {
    const userId = req.userId;
    const Home = await User.findById(userId)
      .populate([
        {
          path: "pages",
          populate: [
            {
              path: "modifiedBy",
              select: selectPopulateService.userPopulate.select,
            },
            { path: "wlddPoc" },
            { path: "entity" },
          ],
        },
        {
          path: "role",
        },
      ])

      .select("-password -expTime -forgetPasswordOtp")
      .sort({ createdAt: -1 });

    // filter pages if updatedAt is less than 10 minutes
    const pages = Home.pages.filter((page) => {
      const updatedAt = new Date(page.updatedAt);
      const currentTime = new Date();
      const diff = currentTime.getTime() - updatedAt.getTime();
      const diffMinutes = Math.floor(diff / 1000 / 60);
      return diffMinutes < 10 && page.modifiedBy._id === userId;
    });

    Home.pages = pages;

    if (Home) {
      res.status(200).json({
        status: true,
        message: "Success",
        data: Home,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "failed",
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
