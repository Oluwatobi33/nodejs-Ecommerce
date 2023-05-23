const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require("mongoose")
const cors = require('cors');
const crypto = require('crypto')
// const session = require('express-session')
// const { sign } = require('jsonwebtoken');
// var stripe = require('stripe')
app.use(express.json({ limit: "50mb" }))
app.use(cors())
app.set("view engine", "ejs");
const PORT = process.env.PORT || 5100

mongoose.connect(process.env.URI, (error) => {
    if (error) {
        console.log(error);
        console.log("Error  ti wa");
    } else {
        console.log("o ti lo");
    }
})

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
app.use(bodyParser.json());
// app.use(session({
//     secret: '123456789abcdefghijklmnopqrstuwyz',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }
// }))


///jjdjjdjjjjdjd

const path = require('path')

var Publishable_Key = process.env.PUBLISHABLE_KEY
var Secret_Key = process.env.SECRET_KEY




// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('Home', {
        key: Publishable_Key
    })
})
app.post('/payment', function (req, res) {


})

const { Viewproduct, registerUser, signinuser, addProduct, addtocart, getaddtocart, removeaddtocart, payment, file, display } = require('./control/adminusercontrol');
const { login, register, forgetPassword, resetPassword, sendpwdlink } = require('./control/userregister');
const { reset } = require('nodemon');

app.post('/payment', payment)
app.post("/upload", file)
app.get("/dashboard", display)
app.post("/addtocart", addtocart)
app.get("/displaygood", addProduct)
app.post("/signup", registerUser)
app.post("/signin", signinuser)
app.post("/signupuser", register)
app.post("/signinuser", login)
// app.get('/verify/:token', verify)
app.post("/getaddtocart", getaddtocart)
app.post("/Viewproduct", Viewproduct)
app.post("/forgetPassword", forgetPassword)
app.get("/resetPassword", resetPassword)
app.post("/sendpasswordlink", sendpwdlink)
app.post("/removeaddtocart", removeaddtocart)

app.listen(PORT, () => {
    console.log("connected successfully");

})