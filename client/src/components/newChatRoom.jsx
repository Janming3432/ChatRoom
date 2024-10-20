import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
const NewChatRoom = ({ setChatRooms, chatRooms }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  // useEffect(() => {
  //   setProfilePicture("");
  //   setchatRoomName("");
  //   setDescription("Hey! There");
  // }, []);

  const handleProfilePictureInput = (e) => {
    const image = e.target.files[0];
    if (image) {
      const profileUrl = URL.createObjectURL(image);
      setProfilePicture(profileUrl);
    }
  };

  const handleFormSubmit = async (e) => {
    const data = new FormData(e.target);
    if (!document.cookie) {
      return navigate("/login");
    }
    const token = document.cookie.split("=")[1].trim();
    try {
      const response = await axios.post("http://localhost:3000/chats", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // const newChatRoom = response.data.chatRoom;
      // console.log(newChatRoom);
      setProfilePicture("");
      setchatRoomName("");
      // throw new Error("ABC");
      // setChatRooms([...chatRooms, newChatRoom]);
      handleClose();
    } catch (err) {
      console.log(err);
      handleClose();
    }
  };
  const handleClose = () => setOpen(false);
  const handleClick = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [chatRoomName, setchatRoomName] = useState("");
  const [description, setDescription] = useState("Hey! There");
  const navigate = useNavigate();

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleClick} size="small">
        <AddIcon />
      </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ "& > :not(style)": { m: 1 }, maxWidth: "400px" }}>
            <Box
              component="form"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit(e);
              }}
            >
              <FormControl variant="standard">
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    onChange={handleProfilePictureInput}
                  />
                  <label htmlFor="profilePicture">
                    <IconButton component="span">
                      <Avatar
                        src={profilePicture || ""}
                        sx={{ width: 100, height: 100 }}
                      ></Avatar>
                    </IconButton>
                  </label>
                  {/* <label>Profile Picture</label> */}
                </Box>
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  required
                  label="ChatRoomName"
                  placeholder="ChatRoomName"
                  id="chatRoomName"
                  name="chatRoomName"
                  value={chatRoomName}
                  onChange={(e) => setchatRoomName(e.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </FormControl>
              <FormControl variant="standard">
                <TextField
                  required
                  label="Description"
                  placeholder="Description"
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </FormControl>

              <Button variant="contained" type="submit">
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default NewChatRoom;
