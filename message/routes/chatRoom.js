const express = require("express");
const router = express.Router();
const chatRoomController = require("../controllers//chatRoom");
const authController = require("../controllers/auth");
const { uploadFilePicture } = require("../helper/uploadPicture");
const { validateJWTToken } = require("../middleware/verifyJWT");

router.use(validateJWTToken);

router.get("/", chatRoomController.getChatRooms);

router.get("/search", chatRoomController.searchChatRoom);

router.post("/", uploadFilePicture, chatRoomController.postChatRoom);

router.put("/:chatRoomId", chatRoomController.putChats);

router.get("/:chatRoomId", chatRoomController.getChatRoom);

router.get("/:chatRoomId/messages", chatRoomController.getMessages);

router.put("/:chatRoomId/addParticipant", chatRoomController.putAddParticipant);
router.put(
  "/:chatRoomId/removeParticipant",
  chatRoomController.putRemoveParticipant
);

module.exports = router;
