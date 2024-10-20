const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profilePictures");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("profilePicture");

exports.uploadFilePicture = (req, res, next) => {
  // console.log(req.body);
  const userId = req.body.userId;
  upload(req, res, (err) => {
    req.body.userId = userId;
    if (err) {
      err.statusCode = 401;
      return next(err);
    }
    return next();
  });
};

exports.deleteFile = (filename) => {
  // console.log()
  const filePath = path.join(__dirname, "../profilePictures/", filename);
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
    // console.log("FILE DELETED");
  });
};
