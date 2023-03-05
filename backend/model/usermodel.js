const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  setFile: String,
});
const productDetails = mongoose.model("productCollection", UserSchema);
const SignUpSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneno: { type: String, required: true },
  DateCreated: { type: String, required: true },
});
// SignUpSchema.validatePassword = function (password, callback) {
//   console.log(this);
//   bcrypt.compare(password.this.password, (err, same) => {
//     console.log(same);
//     if (!err) {
//       callback(err, same);
//     } else {
//       next();
//     }
//   });
// };

SignUpSchema.pre("save", async function (next) {
  let { password } = this;
  console.log(password);
  let salt = await bcrypt.genSalt(10);
  console.log(salt);
  let hashed = await bcrypt.hash(password, salt);
  console.log(hashed);
  this.password = hashed;
  next();
});
// let saltRound = 10;
// SignUpSchema.pre("save", function (next) {
//   console.log(this.password);
//   bcrypt.hash(this.password, saltRound, (err, hashedPassword) => {
//     if (!err) {
//       this.password = hashedPassword;
//       next();
//     }
//   });
// });
const SignUPdetails = mongoose.model("EcommSignup", SignUpSchema);
module.exports = { productDetails, SignUPdetails };
