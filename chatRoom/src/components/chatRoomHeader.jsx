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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ChatRoomHeader = ({ userId, chatRoom, setChatRooms }) => {
  const [open, setOpen] = useState(false);
  // const [chatRoom, setChatRoom] = useState(c);
  // const [chatRoom, setChatRoom] = useState(chatRoom);

  const handleJoinRoom = async (e) => {
    e.stopPropagation();
    const token = document.cookie.split("=")[1].trim();
    try {
      const response = await axios.put(
        `http://localhost:3000/chats/${chatRoom._id}/addParticipant`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      setChatRooms((chatRooms) => {
        if (response.data.chatRoom in chatRooms) return chatRooms;
        else return [response.data.chatRoom, ...chatRooms];
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLeaveRoom = async (e) => {
    e.stopPropagation();
    const token = document.cookie.split("=")[1].trim();
    // console.log(token);
    try {
      const response = await axios.put(
        `http://localhost:3000/chats/${chatRoom._id}/removeParticipant`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatRooms((chatRooms) => {
        const c = chatRooms.filter((c) => c._id !== chatRoom._id);
        return c;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = () => {
    console.log("x");
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
    // console.log("ABGC");
  };

  return (
    <Box onClick={handleOpen} sx={{ cursor: "pointer" }}>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Participants</DialogTitle>
        <List sx={{ pt: 0 }}>
          {chatRoom.participants.map((p) => (
            <ListItem disableGutters key={p._id}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    alt="Remy Sharp"
                    src={`http://localhost:3000${p.profilePicture}`}
                  />
                </ListItemAvatar>
                <ListItemText primary={p.username} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
      <ListItem
        alignItems="center"
        // disablePadding
        sx={{ minWidth: "50vw", width: "100%" }}
        // onClick={() => console.log("hello")}
      >
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src={`http://localhost:3000${chatRoom.profilePicture}`}
          />
        </ListItemAvatar>
        <ListItemText
          primary={chatRoom.chatRoomName}
          secondaryTypographyProps={
            {
              // noWrap: true,
              // textOverflow: "ellipsis",
              // whiteSpace: "nowrap",
              // overflow: "hidden",
              // width: "70vw",
            }
          }
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: "text.primary",
                  // display: "inline",
                  // textOverflow: "ellipsis",
                }}
              >
                {/* {`~ABCD - ` || ""} */}
                {chatRoom.chatRoomDescription}
              </Typography>
              {"ABCDEFF"}
            </React.Fragment>
          }
        />
        {!chatRoom.participants.find((obj) => obj._id === userId) ? (
          <Button
            sx={{ bgcolor: "#4f95f0", textDecoration: "none", color: "white" }}
            onClick={handleJoinRoom}
          >
            Join Room
          </Button>
        ) : (
          <Button
            sx={{ bgcolor: "red", textDecoration: "none", color: "white" }}
            onClick={handleLeaveRoom}
          >
            Leave
          </Button>
        )}
      </ListItem>
      <Divider />
    </Box>
  );
};

export default ChatRoomHeader;
