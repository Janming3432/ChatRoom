import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { DoDisturb } from "@mui/icons-material";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          value: loginId,
          password: password,
        },
        {
          withCredentials: true,
          // credentials: "include",
        }
      );
      // console.log(response.data.user);
      navigate("/chats", { state: { user: response.data.user } });
    } catch (err) {
      setError(true);
      setHelperText("Incorrect username/email or password");
      setPassword("");
      // navigate(0);
      // console.log(err);
    }
  };
  return (
    <>
      <header>
        <h1>Login</h1>
      </header>
      <Box sx={{ "& > :not(style)": { m: 1 }, maxWidth: "400px" }}>
        <Box
          component="form"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <FormControl variant="standard">
            <TextField
              required
              label="Username/Email"
              placeholder="Username/Email"
              error={error}
              helperText={error ? helperText : ""}
              id="loginId"
              name="loginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
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
              // helperText="Incorrect entry."
            />
          </FormControl>
          <p>
            Dont have an account, click{" "}
            <Link href="/signup" underline="none">
              {/* {'underline="none"'} */}
              Here!!!
            </Link>
          </p>
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

export default Login;
