require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cookieParaser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const chatRoomRoutes = require("./routes/chatRoom");

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

// console.log(MONGODB_URI);
app.use(cookieParaser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/profilePictures",
  express.static(path.join(__dirname, "profilePictures"))
);
// app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use("/chats", chatRoomRoutes);

app.use((err, req, res, next) => {
  // err.statusCode = err.statusCode || 500;
  // console.log(err);
  if (!err.statusCode) err.statusCode = 500;
  return res.status(err.statusCode).json({
    errorMessage: err.message,
    message: "Failed",
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(PORT);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      // console.log("CLIENT CONNECTED");
      socket.on("joinRoom", (chatRoomId) => {
        socket.join(chatRoomId);
      });
      socket.on("joinUser", (userId) => {
        socket.join(userId);
      });
      socket.on("disconnect", () => {
        console.log("client disconnected");
      });
    });
    console.log("Connected Successfully");
  })
  .catch((err) => console.log(err));
