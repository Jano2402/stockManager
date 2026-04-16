import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
} from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Stock from "./pages/app/Stock";
import Billings from "./pages/app/Billings";
import Clients from "./pages/app/Clients";
import Logout from "./pages/auth/Logout";

// 🔹 Layout para /app
function AppLayout() {
  return (
    <div>
      <h2>App</h2>

      <nav>
        <Link to="stock">Stock</Link> | <Link to="billings">Billings</Link> |{" "}
        <Link to="clients">Clients</Link>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

// 🔹 Layout para auth
function AuthLayout() {
  return (
    <div>
      <h2>Auth</h2>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root */}
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* Auth */}
        <Route path="auth" element={<AuthLayout />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="refresh" element={<p>Refreshing...</p>} />
        </Route>

        {/* App */}
        <Route path="app" element={<AppLayout />}>
          {/* Home */}
          <Route index element={<p>Bienvenido a la app</p>} />

          {/* Clients */}
          <Route path="clients" element={<Clients />} />
          <Route
            path="clients/*"
            element={<Navigate to="/app/clients" replace />}
          />

          {/* Stock */}
          <Route path="stock" element={<Stock />} />
          <Route
            path="stock/*"
            element={<Navigate to="/app/stock" replace />}
          />

          {/* Billings */}
          <Route path="billings" element={<Billings />} />
          <Route
            path="billings/*"
            element={<Navigate to="/app/billings" replace />}
          />

          {/* 🔥 cualquier otra cosa dentro de /app */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>

        {/* 🔥 cualquier otra cosa global */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
