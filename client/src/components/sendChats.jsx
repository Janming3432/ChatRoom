import * as React from "react";
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

const SendChats = ({ userId, chatRoom }) => {
  const [message, setMessage] = useState("");
  

  const handleMessageSending = async (e) => {
    e.preventDefault();
    if (!document.cookie) {
      navigate("/login");
    }
    const token = document.cookie.split("=")[1].trim();
    // console.log(token);
    try {
      const response = await axios.put(
        `http://localhost:3000/chats/${chatRoom._id}`,
        {
          content: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      setMessage("");
    } catch (err) {
      console.log(err, "ABC");
    }
  };
  return (
    <Box>
      {chatRoom.participants.find((obj) => obj._id === userId) ? (
        <Box
          padding={"1vh 0"}
          sx={{
            position: "sticky",
            top: "100%",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "10px",
            gap: "30px",
            // backgroundColor: "gray",
          }}
          component="form"
          onSubmit={(e) => {
            handleMessageSending(e);
          }}
        >
          <FormControl
            variant="standard"
            sx={{ marginLeft: "5%", width: "85%" }}
          >
            <TextField
              placeholder="Type a message"
              id="message"
              value={message}
              // fullWidth
              variant="outlined"
              onChange={(e) => setMessage(e.target.value)}

              // sx={{width:"80vw"}}
            />
          </FormControl>
          <Button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 0 24 24"
              width="40px"
              fill="#5f6368"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" />
            </svg>
          </Button>
        </Box>
      ) : (
        <Box>Not Allowed</Box>
      )}
    </Box>
  );
};

export default SendChats;
