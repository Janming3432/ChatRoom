import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("Hey! There");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  // const [notSamePasswordError, setNotSamePasswordError] = useState(0);
  const navigate = useNavigate();

  const handleProfilePictureInput = (e) => {
    const image = e.target.files[0];
    if (image) {
      const profileUrl = URL.createObjectURL(image);
      setProfilePicture(profileUrl);
    }
  };

  const handleFormSubmit = async (e) => {
    const data = new FormData(e.target);
    try {
      const response = await axios.post("http://localhost:3000/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for sending files
        },
      });
      // console.log(response);
    } catch (err) {
      console.log(err);
      setNameError(true);
    }
  };
  return (
    <>
      <header>
        <h1>Signup</h1>
      </header>
      <Box sx={{ "& > :not(style)": { m: 1 }, maxWidth: "400px" }}>
        <Box
          component="form"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={(e) => {
            e.preventDefault();
            if (password === repeatPassword) {
              handleFormSubmit(e);
            }
          }}
        >
          <FormControl variant="standard">
            <Box>
              <input
                accept="image/*" // You can restrict file types
                style={{ display: "none" }} // Hide the default input
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
              <label>Profile Picture</label>
            </Box>
          </FormControl>
          <FormControl variant="standard">
            <TextField
              required
              label="Username"
              placeholder="UserName"
              id="userName"
              name="userName"
              error={nameError}
              helperText={nameError ? "username or email already exists" : ""}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
              label="Email"
              placeholder="Email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <FormControl variant="standard">
            <TextField
              required
              label="Password"
              placeholder="Password"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              label="Repeat Password"
              placeholder="Repeat Password"
              id="repeat-password"
              name="repeat-password"
              type="password"
              value={repeatPassword}
              error={password !== repeatPassword}
              helperText={
                password !== repeatPassword ? "Password doesn't match" : ""
              }
              onChange={(e) => setRepeatPassword(e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </FormControl>

          <Button
            variant="contained"
            // size="large"
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Signup;
