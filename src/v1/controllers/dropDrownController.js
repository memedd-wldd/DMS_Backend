const { checkIsOptionPresent } = require("../lib/checkIsOptionPresent");
const DropDown = require("../models/dropdown");

exports.addNewOptions = async (req, res, next) => {
  try {
    const { tag, inActiveReason, category, key ,city ,language} = req.body;
    const [dropDown] = await DropDown.find({});
    
    if (!dropDown) {
      return res.status(404).json({
        status: false,
        message: "Options are not found!",
        data: "",
      });
    } else {
      let isPresent = false;
      let newOption = "";
      switch (key) {
        case "tag":
          isPresent = checkIsOptionPresent(tag, dropDown.tag);
          newOption = tag;
          break;
        case "inActiveReason":
          isPresent = checkIsOptionPresent(
            inActiveReason,
            dropDown.inActiveReason
          );
          newOption = inActiveReason;
          break;
        case "category":
          isPresent = checkIsOptionPresent(category, dropDown.category);
          newOption = category;
          break;
        case "city":
          isPresent = checkIsOptionPresent(city,dropDown.city);
          newOption =city;
          break;
        case "language":
          isPresent = checkIsOptionPresent(language,dropDown.language);
          newOption =language;
          break;
        default:
          return res.status(400).json({
            status: false,
            message: "Wrong key!",
            data: "",
          });
      }

      /*
       * * If already present then rejecting the request
       */
      if (isPresent) {
        return res.status(400).json({
          status: false,
          message: "This option is already present",
          data: "",
        });
      } else {
        dropDown[key] = [...dropDown[key], newOption];
        const newDropDown = await dropDown.save();
        return res.status(200).json({
          status: true,
          message: "Added successfully",
          data: "",
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

exports.getAllDropDown = async (req, res, next) => {
  try {
    const allOptions = await DropDown.find({}).select(
      "-_id -createdAt -updatedAt -__v"
    );
    const tag = allOptions[0].tag.sort();
    const inActiveReason = allOptions[0].inActiveReason.sort();
    const category = allOptions[0].category.sort();
    const city = allOptions[0].city.sort();
    const language =allOptions[0].language.sort();
    const body = { 
      tag,
      inActiveReason,
      category,
      city,
      language,
    }
    if (!allOptions) {
      return res.status(404).json({
        status: false,
        message: "Options are not found",
        data: "",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Found options",
        data: body,
      });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteDropdown = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const [allOptions] = await DropDown.find({}).select(
      "-createdAt -updatedAt -__v"
    );

    switch (key) {
      case "tag":
        allOptions.tag = allOptions.tag.filter((item) => item !== value);
        break;
      case "inActiveReason":
        allOptions.inActiveReason = allOptions.inActiveReason.filter(
          (item) => item !== value
        );
        break;
      case "category":
        allOptions.category = allOptions.category.filter(
          (item) => item !== value
        );
        break;
      case "city":
        allOptions.city =allOptions.city.filter(
          (item)=> item!= value
        );
        break;
      case "language":
        allOptions.language =allOptions.language.filter(
          (item)=> item!= value
        );
        break;
      default:
        return res.status(404).json({
          status: false,
          message: "Wrong key",
          data: "",
        });
    }

    await allOptions.save();
    return res.status(200).json({
      status: true,
      message: "Deleted",
      data: "",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

