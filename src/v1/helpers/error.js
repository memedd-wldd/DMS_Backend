module.exports = (error, req, res, next) => {
  let message = "Something went wrong Try again later"
  if(process.env.NODE_ENV.trim() === "dev"){
    console.log(error);
  }
  if(error.statusCode !== 500){
    message = error.message;
  }
  res.status(error.statusCode).json({
    status: false,
    message:message,
    data: {},
  });
};
