module.exports = (status, text) => {
  const error = new Error(text);
  error.statusCode = status;
  throw error;
};
