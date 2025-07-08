import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Stock from "./pages/app/Stock";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Hola</h1>} />
        // Auth routes
        <Route path="/auth/login" element={<Register />} />
        <Route path="/auth/register" element={<Login />} />
        // App routes
        <Route path="/app/stock" element={<Stock />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
