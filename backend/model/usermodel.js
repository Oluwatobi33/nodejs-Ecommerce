const mongoose = require("mongoose");
const { genSalt, hash } = require("bcrypt")
const bcrypt = require("bcrypt");
const { verify } = require("crypto");
const UserSchema = new mongoose.Schema({
  productname: String,
  price: String,
  description: String,
  setFile: String,

});

const SignUpSchema = new mongoose.Schema({
  Name: String,
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  phoneno: String,
  password: {
    type: String,
  },
  DateCreated: String,
  tokens: [
    {
      token: {
        type: String,
        required: true
      }

    }
  ],
  verifytoken: {
    type: String,

  }

});

SignUpSchema.pre("save", async function (next) {
  const { password } = this
  const salt = await genSalt(10)
  try {
    const hashedPassword = await hash(password, salt)
    this.password = hashedPassword
    next()
    console.log(this.password);
  } catch (error) {
    console.log(error);
  }
})

const RegisterSchema = new mongoose.Schema(
  {
    Name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
  }
)
RegisterSchema.pre("save", async function (next) {
  let { password, email } = this;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  this.password = hashed;
  this.email = email.toLowerCase();
  next();
})


const AddtocartSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      require: true,
    },
    setFile: String,
    price: String,
    productname: String,
    description: String
  }
)
const AddstripeSchema = new mongoose.Schema({
  email: String,
  source: String,
  name: String,
  address: String,
  Country: String,
  State: String,

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
})

const AddStripeModel = mongoose.model("StripeDetails", AddstripeSchema)
const AddtocartModel = mongoose.model('Addtocart', AddtocartSchema)

const RegisterModel = mongoose.model('Customer', RegisterSchema)
const SignUPdetails = mongoose.model("EcommSignup", SignUpSchema);
const productDetails = mongoose.model("productCollection", UserSchema);

module.exports = { productDetails, SignUPdetails, RegisterModel, AddtocartModel, AddStripeModel };
