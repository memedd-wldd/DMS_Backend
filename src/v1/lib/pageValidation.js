module.exports = (fields, pageName) => {
  let flag = 0,
    fieldArray,
    obj = {};
  fields.forEach(async (ele) => {
    if (ele.collectionName === pageName) {
      flag = 1;
      fieldArray = ele.fields;
    }
  });
  obj = {
    flag,
    fieldArray,
  };
  return obj;
};
