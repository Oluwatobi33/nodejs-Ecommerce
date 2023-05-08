const { express } = require("express");
const cloudinary = require("cloudinary");
// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken')
const { productDetails, SignUPdetails } = require("../model/usermodel");
const { AddtocartModel } = require('../model/usermodel')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const file = (req, res) => {
  let myFile = req.body.product.File;
  let productname = req.body.product.productname
  let price = req.body.product.price
  let description = req.body.product.description
  cloudinary.v2.uploader.upload(myFile, { folder: "Ecommerce" }, (err, result) => {
    if (err) {
      res.send({ message: "Upload failed", status: false })
    } else {
      const myFile = result.url;
      console.log(myFile);
      productDetails.create({ productname: productname, price: price, description: description, setFile: myFile, }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ result, message: "Upload successfuly", status: true })
          console.log(result);
        }
      })
    }
  });
}

const addProduct = (req, res) => {
  productDetails.find((error, result) => {
    if (error) {
      res.send({ status: false, message: "item displayed unsuccessful" });
      console.log(error);
    } else {
      console.log(result);
      res.send({
        status: true,
        message: "item displayed successful",
        result
      });
    }
  });
}

const addtocart = (req, res) => {
  let _id = req.body.val;
  let customerId = req.body.customerId;
  productDetails.find({ _id }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let addtocart = result[0];
      console.log(addtocart);
      AddtocartModel.create({
        ...req.body, customerId: customerId, productname: addtocart.productname, price: addtocart.price, File: addtocart.File, description: addtocart.description
        ,
      }, (err, message) => {
        if (err) {
          console.log(err);
          res.send({ status: false, message: "Add to cart was unsuccessful" })
        } else {
          res.send({ status: true, result, message: "Add to cart was successful" })
          console.log(message);
        }
      })
    }
  })
}
const getaddtocart = (req, res) => {
  let customerId = req.body.id
  console.log(customerId);
  console.log("tobi");
  AddtocartModel.find({ customerId }, (err, result) => {
    if (err) {
    } else {
      res.send({ status: true, result, message: "AddToCart get was successful" })
    }
  })
}

const Viewproduct = (req, res) => {
  let _id = req.body.ViewproductId;
  console.log("tobi");
  productDetails.find({ _id }, (err, result) => {
    if (err) {
    } else {
      res.send({ status: true, result, message: "view product was successful" })
      console.log(result);
    }
  })
}

const removeaddtocart = (req, res) => {
  let { id } = req.body;
  AddtocartModel.findByIdAndDelete({ _id: id }, (err, result) => {
    if (err) {
      console.log(err);
    } else {

      res.send({ result });
    }
  })
}

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
}

const signinuser = (req, res) => {
  const { email, password } = req.body;
  SignUPdetails.findOne({ email }, async (err, message) => {
    if (err) {
      res.send(err)
      console.log(err);
    } else {
      if (!message) {
        res.send({ status: false, message: "Email not found" })
      }
      else {
        const validPassword = await bcrypt.compare(password, message.password);
        if (validPassword) {
          const token = jwt.sign({ _id: message._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
          res.send({ token, message: "Token generated", status: true });
        } else {
          res.send({ status: false, message: "Invaild password" })
        }
      }
    }
  })
}

module.exports = { file, addProduct, registerUser, signinuser, addtocart, Viewproduct, getaddtocart, removeaddtocart };
