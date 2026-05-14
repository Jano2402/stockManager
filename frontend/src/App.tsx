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
import Logo from "./components/app/Logo";

/* 
  Colores base:
    [#0B1220]
    [#132238]
  Secundario:
    sky-400
  Acento:
    red-600
  Neutros:
    slate-50
    slate-400
*/

// 🔹 Layout para /app
function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-50 font-space">
      <nav className="w-full flex items-center justify-between px-12 py-4 border-b border-white/10 bg-[#132238]/80 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
          <h2 className="pl-2 text-2xl font-semibold uppercase tracking-wide text-slate-50">
            Soda Baral
          </h2>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            to="stock"
            className="
              px-5 py-2.5 rounded-2xl
              bg-sky-400/10
              border border-sky-400/20
              text-sky-300
              hover:bg-sky-400/20
              hover:border-sky-400/40
              transition-all duration-200
            "
          >
            Stock
          </Link>

          <Link
            to="billings"
            className="
              px-5 py-2.5 rounded-2xl
              bg-red-600/10
              border border-red-500/20
              text-red-400
              hover:bg-red-600/20
              hover:border-red-500/40
              transition-all duration-200
            "
          >
            Facturación
          </Link>

          <Link
            to="clients"
            className="
              px-5 py-2.5 rounded-2xl
              bg-slate-800
              border border-white/10
              text-slate-200
              hover:bg-slate-700
              transition-all duration-200
            "
          >
            Clientes
          </Link>
        </div>
      </nav>

      <main className="p-8">
        <Outlet />
      </main>
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
