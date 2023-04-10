const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require("mongoose")
const cors = require('cors');
// const { sign } = require('jsonwebtoken');
app.use(express.json({ limit: "50mb" }))
app.use(cors())
app.set("view engine", "ejs");
const PORT = process.env.PORT || 5900
mongoose.connect(process.env.URI, (error) => {
    if (error) {
        console.log(error);
        console.log("Error  ti wa");
    } else {
        console.log("o ti lo");
    }
})
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
const { upload, uploadImage, addProduct, registerUser, signinuser } = require('./control/usercontrol')

app.post("/displayPro", uploadImage, upload)
app.get("/dashboard", addProduct)
app.post("/signup", registerUser)
app.post("/signin", signinuser)

app.listen(PORT, () => {
    console.log("connected successfully");

})