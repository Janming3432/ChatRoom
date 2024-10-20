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

const SideBar = ({ user }) => {
  // console.log(user.profilePicture);
  return (
    <Box
      width={"5vw"}
      sx={{ display: "flex", justifyContent: "center" }}
      bgcolor={"#c9c6c5"}
    >
      <Avatar
        alt="Remy Sharp"
        src={`http://localhost:3000${user.profilePicture}`}
        sx={{ marginTop: "20px" }}
      />
    </Box>
  );
};

export default SideBar;
