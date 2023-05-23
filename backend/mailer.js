
const nodemailer = require('nodemailer')
const express = require('express');
const jwt = require('jsonwebtoken');
const { uniqueString } = require('./control/userregister')
// let date = new Date().toLocaleString();
const verifyEmail = async (email) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.email",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAIL_PASSWORD
    }
  })


  module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    console.log("Check");
    transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
        </div>`,
    }).catch(err => console.log(err));
  };

  // var mailOptions;
  // mailOptions = {
  //   from: process.env.EMAIL,
  //   to: email,
  //   subject: 'Email Confirmation',
  //   html: `Press <a href="http://localhost:3000/verify${uniqueString}">here</a>to verify your email.Thanks`
  // }
  // let info = transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) throw Error(error);
  //   console.log('Email Sent Successfully');
  //   console.log(info);
  // });
  // const token = jwt.sign({
  //   data: 'Token Data'
  // }, 'ourSecretKey', { expiresIn: '10m' }
  // );
  // const mailConfigurations = {
  //   // It should be a string of sender/server email
  //   from: process.env.EMAIL,
  //   to: email,
  //   // Subject of Email
  //   subject: 'Email Verification',

  //   // This would be the text of email body
  //   text: `Hi! There, You have recently visited
  //   our website and entered your email.
  //   Please follow the given link to verify your email
  //   http://localhost:5100/verify/${token}
  //   Thanks`

  // };

  // let info = await transporter.sendMail({
  //   from: process.env.EMAIL,
  //   to: email,
  //   subject: "Ecoomerce from tobi app ✔",
  //   // text: "Hello world?",
  //   html: `<div
  //   style="
  //   background: #f0f0f0;
  //   transition: 0.5s;
  //   font-family: Courier New monospace;
  //         padding: 20px;
  //       ">
  //       <h2 style="text-align: center">
  //         THANKS FOR CREATING AN ACCOUNT WITH US.
  //       </h2>
  //       <h3 style="text-align: center">
  //         Welcome to our site. <br />
  //         Your account was successfully created at <span>${date}</span>.
  //         </h3>
  //       <h4 style="text-align: center">
  //       Contact 07032437182 or Email: bakareoluwatobi22@gmail.com <br />
  //       for WEB SITE DEVELOPMENT
  //       </h4>
  //     </div>`,

  // });

  // console.log(info);
}
// const verifyEmail = () => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.MAIL_PASSWORD
//     }
//   });


// }





// const jwt = require('jsonwebtoken');



module.exports = { verifyEmail }