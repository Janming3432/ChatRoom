import React from "react";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { ListItemButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";
import SideBar from "../components/sidebar";
import "../css/scrollBar.css";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import NewChatRoom from "../components/newChatRoom";
import ChatRoom from "../components/chatRoom";

const Chats = () => {
  const socketRef = useRef(null);
  const location = useLocation();

  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [darkMode, setDarkMode] = useState(0);
  const [user, setUser] = useState(location.state.user);
  const [search, setSearch] = useState("");
  const [notFound, setNotFound] = useState(false);
  // console.log(chatRooms);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2", // Custom primary color
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#dc004e", // Custom secondary color
      },
      background: {
        default: darkMode ? "#121212" : "#fafafa", // Custom background color
        paper: darkMode ? "#424242" : "#ffffff", // Paper background color
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000", // Text color
      },
    },
  });

  const navigate = useNavigate();
  useEffect(() => {
    // console.log(user);
    if (!document.cookie) {
      navigate("/login");
    }
  });

  useEffect(() => {
    try {
      const token = document.cookie.split("=")[1].trim();
      const response = async () => {
        const val = await axios.get("http://localhost:3000/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(val.data.chatRooms);
        if (chatRooms.length === 0) {
          setChatRooms((chatRooms) => {
            return [...val.data.chatRooms];
          });
        }
      };
      response();
    } catch (err) {
      // navigate("/login");
      console.log(err);
    }
    socketRef.current = io("http://localhost:3000");
    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinUser", user._id);
    });
    // console.log(chatRooms);
  }, []);

  useEffect(() => {
    if (user && socketRef.current) {
      socketRef.current.on("newChatRoom", (data) => {
        // console.log(data);
        if (data.chatRoom in chatRooms) return;
        // socketRef.current.emit("joinRoom", data.chatRoom._id);
        setChatRooms((chatRooms) => {
          return [data.chatRoom, ...chatRooms];
        });
        // console.log(chatRooms);
      });
    }
    return () => {
      socketRef.current.off("newChatRoom");
    };
  }, [socketRef, user]);

  useEffect(() => {
    // console.log(chatRooms);
    chatRooms.forEach((chatRoom) => {
      socketRef.current.emit("joinRoom", chatRoom._id);
    });
  }, [chatRooms]);

  const handleSearch = async (e) => {
    // console.log("ABC");
    // console.log(search);
    const token = document.cookie.split("=")[1].trim();
    try {
      const response = await axios.get(
        `http://localhost:3000/chats/search?q=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (!response.data.chatRoomId) {
        setNotFound(true);
      }
      setSearch("");
      setSelectedChatRoomId(response.data.chatRoomId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        open={notFound}
        autoHideDuration={3000}
        onClose={(e) => setNotFound(false)}
        message="ChatRoom Not Found"
        // action={action}
      />
      <Box
        sx={{
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "1px",
        }}
      >
        <SideBar user={user} />
        <Box>
          <header
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              height: "12.5vh",
              marginLeft: "6%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1 style={{ margin: "0", padding: "0" }}>Chats</h1>
              <Box sx={{ marginLeft: "160px" }}>
                <NewChatRoom
                  setChatRooms={setChatRooms}
                  chatRooms={chatRooms}
                />
              </Box>
            </Box>
            <Box
              component="form"
              sx={{
                marginLeft: "2%",
                // width: "100%",
                padding: "0",
                // height: "inherit",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(e);
              }}
            >
              <FormControl variant="standard">
                <TextField
                  id="search"
                  name="search"
                  label="Search"
                  variant="standard"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  fullWidth
                  // sx={{ width: "100%", padding: "0" }}
                />
              </FormControl>
            </Box>
          </header>
          {chatRooms.length > 0 ? (
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                overflowX: "hidden",
                // maxHeight: "88vh",
                height: "87.5vh",
                overflowY: "auto",
              }}
            >
              {chatRooms.map((chatRoom, idx) => {
                // console.log(chatRoom._id);
                return (
                  <div key={chatRoom._id}>
                    <ListItem alignItems="flex-start" disablePadding>
                      <ListItemButton
                        onClick={(e) => setSelectedChatRoomId(chatRoom._id)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt="Remy Sharp"
                            src={`http://localhost:3000${chatRoom.profilePicture}`}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={chatRoom.chatRoomName}
                          secondaryTypographyProps={{
                            noWrap: true,
                            // fontSize: 12,
                            // lineHeight: "16px",
                          }}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: "text.primary",
                                  display: "inline",
                                }}
                              >
                                {/* {`~ABCD - ` || ""} */}
                              </Typography>
                              {chatRoom.messages.length > 0
                                ? chatRoom.messages[
                                    chatRoom.messages.length - 1
                                  ].content
                                : "New ChatRoom"}
                              {/* ABCDEFFGAGSGASASGGSAsAGSASGAGSASG */}
                            </React.Fragment>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </div>
                );
              })}
            </List>
          ) : (
            <Box
              sx={{
                lineHeight: "98vh",
                textAlign: "center",
                fontSize: "1.5rem",
              }}
            >
              No Chats
            </Box>
          )}
        </Box>
        <Box width={"100%"} height={"100%"}>
          <ChatRoom
            chatRoomId={selectedChatRoomId}
            socketRef={socketRef}
            setChatRooms={setChatRooms}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chats;
