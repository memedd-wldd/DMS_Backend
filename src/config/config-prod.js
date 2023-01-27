require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const config = {
  host: process.env.HOST,
  DB_URI: process.env.DB_URI,
  JWT_ACTIVATE: process.env.JWT_ACTIVATE,
  port: process.env.PORT,
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  AWS_MAILSENDERHOST:process.env.AWS_MAILSENDERHOST,
  AWS_SESACCESSID:process.env.AWS_SESACCESSID,
  AWS_SESACCESSKEY:process.env.AWS_SESACCESSKEY 
};

module.exports = config;
