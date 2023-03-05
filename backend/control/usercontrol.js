const { express } = require("express");
const cloudinary = require("cloudinary");
// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken')
const { productDetails, SignUPdetails } = require("../model/usermodel");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImage = (req, res, next) => {
  let myFile = req.body.product.setFile;
  console.log(myFile);
  cloudinary.v2.uploader.upload(myFile, (err, result) => {
    if (err) {
      console.log("File could not be uploaded");
    } else {
      req.awaited_url = result.secure_url;
      next();
    }
  });
};

const upload = (req, res) => {
  const image = req.awaited_url;
  let { name, price, description } = req.body.product;
  const details = { name, price, description, setFile: image };
  console.log(details);
  productDetails.create(details, (err, result) => {
    if (err) {
      res.send({ status: false, message: "one input field is empty" });
    } else {
      console.log(result);
      console.log("successfully");
      res.send({ status: true, message: result });
    }
  });
};

const addProduct = (req, res) => {
  productDetails.find((error, result) => {
    if (error) {
      res.render({ status: false, message: "item displayed unsuccessful" });
      console.log(error);
    } else {
      console.log(result);
      res.render({
        status: true,
        message: "item displayed successful",
        result
      });
    }
  });
};
const registerUser = (req, res) => {
  console.log(req.body);
  let form = new SignUPdetails(req.body);
  form.save((err) => {
    if (err) {
      res.send({ status: false, message: "it didn't send" });
    } else {
      res.send({ status: true, message: "Signup successfully" });
    }
  });
};
const signinuser = (req, res) => {
  console.log(req.body);
  let password = req.body;
  SignUPdetails.findOne({ email: req.body.email }, (err, result) => {
    if (err) {
      res.send({ message: "Server Error", status: false });
    } else {
      if (result) {
        result.validatePassword(password, (err, result) => {
          if (err) {
            res.send({ message: "Email Exists", status: false });
          } else {
            if (result) {
              res.send({
                message: "user Signed in successfully",
                satus: "true",
              });
            } else {
              res.send({ message: "Wrong Password", status: false });
            }
          }
        });
      }
    }
  });
};
module.exports = { upload, uploadImage, addProduct, registerUser, signinuser };
