import React from "react";
import Button from "@mui/material/Button";


const Home = () => {
  return (
    <>
      <header>
        <h1>ChatRoom</h1>
      </header>
      <div>
        <p>Welcome to chatRoom Click the button below to get Started</p>
        <Button
          variant="contained"
          size="large"
          href="/login"
          sx={{
            whiteSpace: "normal",
            textAlign: "center",
          }}
        >
          Get Started
        </Button>
      </div>
    </>
  );
};

export default Home;
