import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Stock from "./pages/app/Stock";
import Logout from "./pages/auth/Logout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root */}
        <Route path="/" element={<h1>Hola jaja</h1>} />

        {/* Auth routes */}
        <Route path="auth">
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* App routes */}
        <Route path="app">
          {/* Stock routes */}
          <Route path="stock" element={<Stock />}>
            <Route path="products" element={<></>}>
              <Route path=":id" element={<></>} />
            </Route>
          </Route>
          {/* Billings routes */}
          <Route path="billings" element={<Stock />}>
            <Route path="purchases" element={<></>} />
          </Route>
          {/* Clients routes */}
          <Route path="clients" element={<Stock />}>
            <Route path="init" element={<></>} />
            <Route path="search" element={<></>} />
            <Route path=":id/purchases" element={<></>} />
            <Route path=":id/modify" element={<></>} />
            <Route path=":id/delete" element={<></>} />
            <Route path="purchases/:id" element={<></>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
