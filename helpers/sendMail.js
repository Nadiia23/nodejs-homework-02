const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
    const mail = { ...data, from: "nadezhda.kylinich@gmail.com" };
    /* eslint-disable no-undef */
    transporter
        .sendMail(mail)
        .then(() => console.log("Mail sent"))
        .cathc((e) => console.log("e.message"));
    
};

module.exports = sendMail;