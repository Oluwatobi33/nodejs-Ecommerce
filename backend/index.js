const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require("mongoose")
const cors = require('cors');
// const session = require('express-session')
// const { sign } = require('jsonwebtoken');
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

const { upload, uploadImage, Viewproduct, addProduct, addtocart, getaddtocart, removeaddtocart, file } = require('./control/adminusercontrol');
const { display, login, regist } = require('./control/userregister');

app.post("/upload", file)
app.get("/dashboard", display)
app.post("/addtocart", addtocart)
app.get("/displaygood", addProduct)
app.post("/signup", regist)
app.post("/signin", login)
app.post("/getaddtocart", getaddtocart)
app.post("/Viewproduct", Viewproduct)
app.post("/removeaddtocart", removeaddtocart)

app.listen(PORT, () => {
    console.log("connected successfully");

})