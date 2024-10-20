const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true }, // Unique username
  email: { type: String, required: true, unique: true }, // User's email
  password: { type: String, required: true }, // Encrypted password
  profilePicture: { type: String, default: "abc" }, // URL to the profile picture (optional)
  status: { type: String, default: "Hey there! I am using the app." }, // User's status message
  contacts: [{ type: Schema.Types.ObjectId, ref: "User" }], // List of contacts (references to other users)
  participatingChatRooms: [{ type: Schema.Types.ObjectId, ref: "ChatRoom" }],
  lastSeen: { type: Date, default: Date.now }, // Last seen timestamp
  createdAt: { type: Date, default: Date.now }, // Account creation date
});

module.exports = mongoose.model("User", userSchema);
