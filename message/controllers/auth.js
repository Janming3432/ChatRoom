require("dotenv").config();
const fs = require("fs");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { deleteFile } = require("../helper/uploadPicture");

exports.postLogin = async (req, res, next) => {
  const value = req.body.value;
  const password = req.body.password;
  try {
    const existingUser = await User.findOne({
      $or: [{ email: value }, { username: value }],
    });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    // console.log(isCorrectPassword);
    if (!isCorrectPassword) {
      // throw new Error("Incorrect Password");
      return res.send(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      // sameSite: "none",
      // secure: true,
      httpOnly: false,
      maxAge: 3600000,
    });
    // console.log(existingUser);
    return res.status(200).json({
      message: "successful",
      token: token,
      user: existingUser,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
};

exports.postSignup = async (req, res, next) => {
  // console.log(req.body);
  const email = req.body.email;
  const description = req.body.description;
  const userName = req.body.userName;
  const password = req.body.password;
  console.log(req.file);
  const profilePicture = req.file
    ? `/profilePictures/${req.file.filename}`
    : "abc";
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) {
      throw new Error("Some Error Occurred!!!\nPlease Try again");
    }
    const newUser = await new User({
      username: userName,
      email: email,
      password: hashedPassword,
      description: description,
      profilePicture: profilePicture,
    }).save();
    // await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    if (req.file) deleteFile(req.file.filename);
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
};

exports.checkUserExists = async (req, res, next) => {
  const userName = req.body.userName;
  const email = req.body.email;
  // console.log(req.file);
  try {
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: userName }],
    });
    if (existingUser) {
      if (req.file) deleteFile(req.file.filename);
      throw new Error("User with same email or password already exists");
    } else return next();
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
};
