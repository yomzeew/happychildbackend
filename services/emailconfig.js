const nodemailer=require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'miresumiresume@gmail.com',
      pass: 'qtwq xrkq nvbp vdch',
    },
  });
 module.exports=transporter