import * as React from "react";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { ListItemButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ChatRoomHeader from "./chatRoomHeader";
import SendChats from "./sendChats";
import Messages from "./messages";

const ChatRoom = ({ chatRoomId, socketRef, setChatRooms }) => {
  const [chatRoom, setChatRoom] = useState(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (chatRoomId !== null) {
      const token = document.cookie.split("=")[1].trim();
      // console.log(token);
      const getResponse = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/chats/${chatRoomId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(response.data);
          setChatRoom(response.data.chatRoom);
          setUserId(response.data.userId);
          // console.log(chatRoom);
        } catch (err) {
          // console.log(err);
        }
      };
      getResponse();
    }
  }, [chatRoomId]);

  return (
    <>
      {chatRoom ? (
        <Box
          minHeight={"98vh"}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <ChatRoomHeader
            chatRoom={chatRoom}
            userId={userId}
            setChatRooms={setChatRooms}
          />
          <Messages socketRef={socketRef} chatRoom={chatRoom} userId={userId} />
          <SendChats chatRoom={chatRoom} userId={userId} />
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            lineHeight: "98vh",
            fontSize: "1.5rem",
          }}
        >
          <Box>
            Oops!!! No ChatRoom Selected. Create a new ChatRoom or Select One
            from the left
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatRoom;
