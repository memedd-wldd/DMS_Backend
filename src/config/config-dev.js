const path = require('path')

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const config = {
  host: process.env.DEV_HOST,
  DB_URI: process.env.DEV_DB_URI,
  JWT_ACTIVATE: process.env.DEV_JWT_ACTIVATE,
  port: process.env.DEV_PORT,
  email: process.env.DEV_EMAIL,
  password: process.env.DEV_PASSWORD,
  AWS_MAILSENDERHOST:process.env.DEV_AWS_MAILSENDERHOST,
  AWS_SESACCESSID:process.env.DEV_AWS_SESACCESSID,
  AWS_SESACCESSKEY:process.env.DEV_AWS_SESACCESSKEY 
};

module.exports = config;
