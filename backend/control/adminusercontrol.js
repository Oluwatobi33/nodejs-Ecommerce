const { express } = require("express");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const { productDetails, RegisterModel, AddStripeModel } = require("../model/usermodel");
const { AddtocartModel } = require('../model/usermodel')
const stripe = require('stripe')

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
        ...req.body, customerId: customerId, productname: addtocart.productname, price: addtocart.price, setFile: addtocart.setFile, description: addtocart.description
        ,
      }, (err, message) => {
        if (err) {
          console.log(err);
          res.send({ status: false, message: "Add to cart was unsuccessful" })
        } else {
          if (!result) {
            res.send({ status: false, result, message: "cart is empty" })
            console.log(message);
          }
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
      if (!result) {
        res.send({ status: true, result, message: "AddToCart is empty" })
      }
      console.log(result);
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
const payment = (req, res) => {
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  // stripe.customers.create({
  //   email: req.body.stripeEmail,
  //   source: req.body.stripeToken,
  //   name: 'Gourav Hammad',
  //   address: {
  //     line1: 'TC 9/4 Old MES colony',
  //     postal_code: '452331',
  //     city: 'Indore',
  //     state: 'Madhya Pradesh',
  //     country: 'India',
  //   }
  console.log(req.body);
  let form = new AddStripeModel(req.body);
  form.save((err, result) => {
    if (err) {
      res.send({ status: false, message: "it didn't send" });
    } else {
      res.send({ result, status: true, message: " Saved successfully" });
    }
  });
}

const registerUser = (req, res) => {
  console.log(req.body);
  let form = new RegisterModel(req.body);
  form.save((err, result) => {
    if (err) {
      res.send({ status: false, message: "it didn't send" });
    } else {
      res.send({ result, status: true, message: "Signup successfully" });
    }
  });
}

const signinuser = (req, res) => {
  const { email, password } = req.body;
  RegisterModel.findOne({ email }, async (err, message) => {
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
const display = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.send({ status: false, message: "Invalid Token" })
    } else {
      let id = decoded._id;
      RegisterModel.find({ _id: id }, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          if (result.length > 0) {
            res.send({ result, status: true, message: "Valid Token" })
          }
          else {
            console.log(result);
            res.send({ message: "empty array" })
          }
        }
      })
    }
  })
}

module.exports = { file, addProduct, registerUser, signinuser, addtocart, Viewproduct, getaddtocart, removeaddtocart, payment, display };
