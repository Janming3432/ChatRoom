import React from "react";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Chats from "./pages/chats";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chats" element={<Chats />} />
        {/* <Route path="/chats" element={<Chats />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
