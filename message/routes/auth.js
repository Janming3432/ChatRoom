const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { uploadFilePicture } = require("../helper/uploadPicture");


router.post("/login", authController.postLogin);
router.post(
  "/signup",
  uploadFilePicture,
  authController.checkUserExists,
  authController.postSignup
);

module.exports = router;
