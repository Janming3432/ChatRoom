const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.validateJWTToken = (req, res, next) => {
  // console.log(req.headers["authorization"]);
  const token = req.headers["authorization"].split(" ")[1].trim();

  try {
    if (!token) throw new Error("Invalid token");
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      { maxAge: "1h" },
      (err, decoded) => {
        if (err) throw new Error("Intvalid jwt token, login Again");
        req.body.userId = decoded.userId;
        // console.log(req.body.userId);
        return next();
      }
    );
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
};
