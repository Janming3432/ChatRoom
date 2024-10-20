const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatRoomSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }], // Array of user references
  isGroupChat: { type: Boolean, default: true }, // Boolean to differentiate between 1-to-1 and group chats
  chatRoomName: { type: String }, // Group name for group chats (optional)
  chatRoomAdmin: [{ type: Schema.Types.ObjectId, ref: "User", required: true }], // Reference to the group admin (only for group chats)
  profilePicture: { type: String, default: "abc" },
  chatRoomDescription: { type: String },
  messages: [
    {
      // _id: false,
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Who sent the message
      content: { type: String, required: true }, // The message content
      sentAt: { type: Date, default: Date.now }, // Timestamp when the message was sent
      // seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of users who have seen the message
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Timestamp when the chat was created
  updatedAt: { type: Date, default: Date.now },
  updateCounter: { type: Number, default: 0 },
});

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
