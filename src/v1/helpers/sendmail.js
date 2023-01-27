const nodemailer = require("nodemailer");
const config = require("../../config/config");

//create transporter
let transporter = nodemailer.createTransport({
  host: config.AWS_MAILSENDERHOST,
  port: Number(process.env.DEV_SMTP_PORT),
  secure: false,
  auth: {
    user: config.AWS_SESACCESSID,
    pass: config.AWS_SESACCESSKEY,
  },
});

console.log(transporter);

//sending mail
exports.sendMail = async (emailTo, subject, text, html, file) => {
  try {
    let defaultmailOption = {
      from: {
        name: "DMS ADMIN",
        address: process.env.EMAIL,
      },
      to: emailTo,
      subject: subject,
      text: text,
      html: html,
    };
    let mailOption = {};
    if (file) {
      mailOption = {
        ...defaultmailOption,
        attachments: [
          {
            filename: "receipt",
            path: file,
          },
        ],
      };
    } else {
      mailOption = {
        ...defaultmailOption,
      };
    }
    //console.log(mailOption);
    let resp = await transporter.sendMail(mailOption);
    return resp;
  } catch (err) {
    console.log(err);
  }
};
