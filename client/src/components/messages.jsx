import * as React from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
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
import { Calculate } from "@mui/icons-material";

const Messages = ({ chatRoom, socketRef, userId }) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(userId);

  const chatBoxRef = useRef(null);
  const endOfMessageRef = useRef(null);

  useEffect(() => {
    // setTimeout(() => {
    // console.log(chatRoom);
    endOfMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, 100);
  }, [messages]);

  useEffect(() => {
    if (!document.cookie) {
      navigate("/login");
    }
    const token = document.cookie.split("=")[1].trim();
    const response = async () => {
      try {
        const val = await axios.get(
          `http://localhost:3000/chats/${chatRoom._id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(val);
        // console.log(val.data[0]);
        if (val.data.length > 0)
          setMessages([...val.data[0].messages].reverse());
        else setMessages([]);
      } catch (err) {
        console.log(err);
      }
    };
    response();
  }, [chatRoom]);

  useEffect(() => {
    if (chatRoom && socketRef.current) {
      socketRef.current.on("newMessage", (data) => {
        // console.log(data);
        if (data in messages) return;
        setMessages((messages) => {
          return [...messages, data.message];
        });
      });
    }
    return () => {
      socketRef.current.off("newMessage");
    };
  }, [socketRef, chatRoom]);

  return (
    <Box
      width={"100%"}
      ref={chatBoxRef}
      sx={{
        bgcolor: "#dbd7d7",
        overflowX: "hidden",
        overflowY: "auto",
        height: "85vh",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px",
            gap: "10px",
            padding: "1%",
            bgcolor: "#c9c6c5",
            borderRadius: "10px",
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src={`http://localhost:3000${chatRoom.profilePicture}`}
          />
          <Typography component={"h4"} variant="h5">
            {chatRoom.chatRoomName}
          </Typography>
          <Typography component={"p"} variant="p">
            {chatRoom.chatRoomDescription}
          </Typography>
        </Box>
      </Box>
      <List>
        {messages.length > 0
          ? messages.map((message) => {
              if (message.content.length === 0) return null;
              // console.log(message.sender._id, user);
              return (
                <Box
                  key={message._id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender._id === user ? "end" : "start",
                  }}
                >
                  <Box
                    component={"div"}
                    sx={{
                      overflowWrap: "break-word",
                      maxWidth: "25%",
                      padding: "1%",
                      overflow: "hidden",
                      textAlign: "left",
                      marginTop: "5px",
                      marginLeft: message.sender._id === user ? "0" : "5%",
                      marginRight: message.sender._id === user ? "5%" : "0",
                      bgcolor:
                        message.sender._id === user ? "green" : "#5c5959",
                      borderRadius: "10px",
                    }}
                  >
                    {message.sender._id === user ? null : (
                      <Box
                        component={"span"}
                        fontWeight={"bold"}
                        color={"#28c3ed"}
                      >
                        {message.sender.username}
                      </Box>
                    )}
                    <Box color={"white"}>{message.content}</Box>
                  </Box>
                </Box>
              );
            })
          : null}
        <Box ref={endOfMessageRef}></Box>
      </List>
    </Box>
  );
};

export default Messages;
