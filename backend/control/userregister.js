// const mongoose = require('mongoose');
const { SignUPdetails } = require('../model/usermodel');
const cloudinary = require('cloudinary');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyEmail } = require('../mailer');
require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: "1234567"
    }
})
const keysecret = process.env.JWT_SECRET

const register = (req, res) => {
    const { email } = req.body
    // const details = req.body
    console.log(req.body);
    let form = new SignUPdetails(req.body);
    form.save((err, result) => {
        if (err) {
            res.send({ status: false, message: "it didn't send" });
        } else {
            verifyEmail(email)
            res.send({ result, status: true, message: "Signup successfully" });
        }
    });
}

const login = (req, res) => {
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
                    const token = jwt.sign({ _id: message._id }, process.env.JWT_SECRET, { expiresIn: "3h" })
                    res.send({ token, message: "Token generated", status: true });
                } else {
                    res.send({ status: false, message: "Invaild password" })
                }
            }
        }
    })
}

// const display = (req, res) => {
//     const token = req.headers.authorization.split(' ')[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             res.send({ status: false, message: "Invalid Token" })
//         } else {
//             let id = decoded._id;
//             SignUPdetails.find({ _id: id }, (err, result) => {
//                 if (err) {
//                     res.send(err);
//                 } else {
//                     if (result.length > 0) {
//                         res.send({ result, status: true, message: "Valid Token" })
//                     }
//                     else {
//                         console.log(result);
//                         res.send({ message: "empty array" })
//                     }
//                 }
//             })
//         }
//     })
// }

const forgetPassword = async (req, res) => {
    const { email } = req.body
    try {
        const oldUser = await SignUPdetails.findOne({ email });
        if (oldUser) {
            return res.json({ status: "user not Exist" })
        }
        const secret = JWT_SECRET + oldUser.password
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "5m" });
        const link = `http://localhost:5100/forgetPassword${oldUser._id}/${token}`
        console.log(link);
    } catch (error) {
        console.log(error);
    }
}

const resetPassword = (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
}
const sendpwdlink = async (req, res) => {
    console.log(req.body);
    const { email } = req.body;
    if (!email) {
        res.status(401).json({ status: 401, message: "Enter your email" })
    }
    try {
        const userfind = await SignUPdetails.findOne({ email: email })
        const token = jwt.sign({ _id: userfind._id }, keysecret, {
            expiresIn: "120s"
        })
        const setusertoken = await SignUPdetails.findByIdAndUpdate({ _id: userfind._id, }, { verifytoken: token });
        res.send({ setusertoken, status: true, message: "update successful" })
        console.log("setusertoken");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { login, register, forgetPassword, resetPassword, sendpwdlink };
