const nodemailer=require('nodemailer')
const transporter = nodemailer.createTransport({
    host:process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
 module.exports=transporter