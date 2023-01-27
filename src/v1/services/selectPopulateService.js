exports.selectPopulateService = {
  entityPopulate: {
    select: "_id name",
    negativeSelect:
      "-pages -commercials -createdAt -modifiedAt -__v -isDeleted -isBlocked -updatedAt",
  },
  distributorPopulate: {
    select: "_id name",
  },
  pagePopulate: {
    select: "_id name",
    negativeSelect: "-__v -isDelete -isBlocked -distributors -commercials",
  },
  userPopulate: {
    select: "_id name userName driveFolderId",
  },
  primaryDistributorPopulate: {
    select: "_id name",
    negativeSelect:
      "-commercials -entity -createdBy -modifiedBy -entityWithCommercials -pages -__v -isDeleted -isBlocked",
  },
  primaryCommercialPopulate: {
    select: "_id name",
    negativeSelect: "-isDeleted -__v -createdAt -updatedAt",
  },
  distributionPopulate: {
    select: "_id name",
    negativeSelect: "-__v -isDelete -isBlocked",
  },
};
