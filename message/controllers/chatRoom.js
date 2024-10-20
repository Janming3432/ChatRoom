const ChatRoom = require("../models/chat");
const User = require("../models/user");
const { deleteFile } = require("../helper/uploadPicture");
const io = require("../socket");
const mongoose = require("mongoose");

exports.getChatRooms = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "chatrooms",
          localField: "participatingChatRooms",
          foreignField: "_id",
          as: "participatingChatRooms",
        },
      },
      {
        $unwind: {
          path: "$participatingChatRooms",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { "participatingChatRooms.updatedAt": -1 } },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" },
          email: { $first: "$email" },
          profilePicture: { $first: "$profilePicture" },
          contacts: { $first: "$contacts" },
          createdAt: { $first: "$createdAt" },
          participatingChatRooms: { $push: "$participatingChatRooms" },
        },
      },
    ]);
    // console.log(user);

    if (user.length === 0) throw new Error("User Not Authorized");
    res.status(200).json({ chatRooms: user[0].participatingChatRooms });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
};

exports.searchChatRoom = async (req, res, next) => {
  const userId = req.body.userId;
  const search = req.query.q;
  const chatRoom = await ChatRoom.findOne({ chatRoomName: search });
  if (!chatRoom) return res.status(200).json({ message: "not found" });
  return res
    .status(200)
    .json({ message: "successful", chatRoomId: chatRoom._id });
  // return next(new Error("LOL"));
};

exports.postChatRoom = async (req, res, next) => {
  const userId = req.body.userId;
  const chatRoomName = req.body.chatRoomName;
  const participants = [userId];
  const chatRoomAdmin = [userId];

  const chatRoomDescription =
    req.body.chatRoomDescription || `Created at ${new Date().toISOString()}`;
  const profilePicture = req.file
    ? `/profilePictures/${req.file.filename}`
    : "abc";
  // return next(new Error("HELOO"));

  try {
    const currentUser = await User.findOne({ _id: userId });
    if (!currentUser) throw new Error("Not Authorized");

    const newChatRoom = await new ChatRoom({
      chatRoomAdmin: chatRoomAdmin,
      chatRoomName: chatRoomName,
      participants: participants,
      chatRoomDescription: chatRoomDescription,
      profilePicture: profilePicture,
    }).save();

    currentUser.participatingChatRooms.push(newChatRoom._id);
    await currentUser.save();

    const chatRoom = await ChatRoom.findOne({ _id: newChatRoom._id });

    io.getIO().to(userId).emit("newChatRoom", {
      chatRoom,
    });

    return res.status(201).json({
      message: "Created Successfully",
      chatRoom: chatRoom,
    });
  } catch (err) {
    if (req.file) deleteFile(req.file.filename);
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
};

exports.getChatRoom = async (req, res, next) => {
  // console.log(req.params.chatRoomId);
  // res.status(200).send("OK");
  const chatRoomId = req.params.chatRoomId;
  const userId = req.body.userId;

  // console.log(chatRoomId, userId);
  // return next(new Error("HLLO"));
  try {
    const chatRoom = await ChatRoom.findOne({
      _id: chatRoomId,
      // participants: userId,
    }).populate({
      path: "participants",
      model: "User",
      select: "username profilePicture _id",
    });
    if (!chatRoom) throw new Error("You Dont have access to this chatRoom");
    res.status(200).json({
      chatRoom: chatRoom,
      userId: userId,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
};

exports.putChats = async (req, res, next) => {
  //   console.log("HELLo");
  const chatRoomId = req.params.chatRoomId;
  const sender = req.body.userId;
  const content = req.body.content;
  // console.log(sender, content);
  try {
    const chatRoom = await ChatRoom.findOneAndUpdate(
      {
        _id: chatRoomId,
        participants: sender,
      },
      {
        $push: { messages: { sender: sender, content: content } },
        updatedAt: Date.now(),
      },
      { new: true, projection: { messages: { $slice: -1 } } }
    ).populate({
      path: "messages.sender",
      model: "User",
      select: "username _id profilePicture",
    });
    if (!chatRoom) throw new Error("ChatRoom doesnt exist");
    // console.log(chatRoom.messages);

    // console.log(chatRoom);
    // console.log(chatRoomId);
    io.getIO().to(chatRoomId).emit("newMessage", {
      chatRoomId,
      message: chatRoom.messages[0],
    });

    return res.status(200).json({
      message: "success",
      chats: chatRoom.messages,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
};

exports.putAddParticipant = async (req, res, next) => {
  const chatRoomId = req.params.chatRoomId;
  const participantId = req.body.userId;
  // console.log(chatRoomId, participantId);
  // return next(new Error("HAHA"));
  try {
    const currUser = await User.findByIdAndUpdate(
      participantId,
      {
        $addToSet: { participatingChatRooms: chatRoomId },
      },
      { new: true }
    );
    const chatRoom = await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      {
        $addToSet: { participants: participantId },
      },
      { new: true }
    );
    if (!chatRoom) throw new Error("ChatRoom Does not exist");
    if (!currUser) throw new Error("User Not Found");

    res.status(200).json({
      message: "Participant added successfully",
      chatRoom: chatRoom,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    next(err);
  }
};

exports.putRemoveParticipant = async (req, res, next) => {
  const chatRoomId = req.params.chatRoomId;
  const participantId = req.body.userId;
  // console.log("ABC");
  try {
    const currUser = await User.findByIdAndUpdate(
      participantId,
      {
        $pull: { participatingChatRooms: chatRoomId },
      },
      { new: true }
    );
    const chatRoom = await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      {
        $pull: { participants: participantId },
      },
      { new: true }
    );
    if (!chatRoom) throw new Error("ChatRoom Does not exist");
    if (!currUser) throw new Error("User Not Found");

    res.status(200).json({
      message: "Participant removed successfully",
      chatRoom: chatRoom,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  const chatRoomId = req.params.chatRoomId;
  const userId = req.body.userId;
  try {
    const messages = await ChatRoom.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(chatRoomId) } },
      { $unwind: "$messages" },
      { $sort: { "messages.sentAt": -1 } },
      {
        $lookup: {
          from: User.collection.name, // The name of the User collection
          localField: "messages.sender", // Field from the messages array
          foreignField: "_id", // Field from the User collection
          as: "senderDetails", // Output array field
        },
      },
      { $unwind: { path: "$senderDetails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: {
              content: "$messages.content",
              sentAt: "$messages.sentAt",
              _id: "$messages._id",
              sender: {
                _id: "$senderDetails._id",
                username: "$senderDetails.username",
                profilePicture: "$senderDetails.profilePicture",
              },
            },
          }, // Group back the comments
        },
      },
      {
        $project: {
          _id: 0, // Exclude the `_id` field
          messages: { $slice: ["$messages", 500] }, // Limit messages to the specified `limit`
        },
      },
    ]);
    res.status(200).json(messages);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
};
