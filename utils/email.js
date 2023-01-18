const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  var transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: '2525',
    auth: {
      user: '8cc82b149651ea',
      pass: '7a77c00ea7bdb0',
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "CRUD SOCCER <crud@soccer.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
