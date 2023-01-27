exports.checkIsOptionPresent = (newOption, oldOptions) => {
  console.log(newOption,oldOptions);
  const isFound = oldOptions.find(
    (oldOption) => oldOption.toLowerCase() === newOption.toLowerCase()
  );
  if (isFound !== undefined) {
    return true;
  } else {
    return false;
  }
};
