import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  Navigate,
  NavLink,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-50 font-space">
      <nav className="w-full flex items-center justify-between px-12 py-4 border-b border-white/10 bg-[#132238]/80 backdrop-blur-md relative">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
          <h2 className="pl-2 text-2xl font-semibold uppercase tracking-wide text-slate-50">
            Soda Baral
          </h2>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3 text-sm font-medium">
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

        {/* Hamburger Button */}
        <button
          onClick={() => setOpen(!open)}
          className="
            md:hidden
            flex flex-col gap-1
            p-2
          "
        >
          <div className="w-6 h-0.5 bg-white rounded" />
          <div className="w-6 h-0.5 bg-white rounded" />
          <div className="w-6 h-0.5 bg-white rounded" />
        </button>

        {/* Mobile Menu */}
        {open && (
          <div
            className="
              absolute
              top-20
              right-6
              md:hidden
              flex flex-col gap-3
              p-4
              rounded-2xl
              bg-[#132238]
              border border-white/10
              shadow-2xl
            "
          >
            <Link
              to="stock"
              onClick={() => setOpen(false)}
              className="
                px-5 py-2.5 rounded-2xl
                bg-sky-400/10
                border border-sky-400/20
                text-sky-300
              "
            >
              Stock
            </Link>

            <Link
              to="billings"
              onClick={() => setOpen(false)}
              className="
                px-5 py-2.5 rounded-2xl
                bg-red-600/10
                border border-red-500/20
                text-red-400
              "
            >
              Facturación
            </Link>

            <Link
              to="clients"
              onClick={() => setOpen(false)}
              className="
                px-5 py-2.5 rounded-2xl
                bg-slate-800
                border border-white/10
                text-slate-200
              "
            >
              Clientes
            </Link>
          </div>
        )}
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
    <div className="min-h-screen bg-[#0B1220] text-slate-50 font-space">
      {/* Navbar minimalista */}
      <nav
        className="
          w-full

          flex items-center justify-between

          px-6 
          py-3

          bg-[#132238]

          border-b border-slate-700/40
        "
      >
        <div className="flex items-center gap-3">
          <Logo />

          <h2 className="text-xl font-semibold text-slate-100">Soda Baral</h2>
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          <NavLink
            to="/auth/login"
            className={({ isActive }) =>
              `
                px-5 py-2.5
                rounded-2xl

                border

                transition-all duration-200

                ${
                  isActive
                    ? "bg-sky-400/20 border-sky-400/40 text-sky-300"
                    : "bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700"
                }
              `
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/auth/register"
            className={({ isActive }) =>
              `
                px-5 py-2.5
                rounded-2xl

                border

                transition-all duration-200

                ${
                  isActive
                    ? "bg-emerald-400/20 border-emerald-400/40 text-emerald-300"
                    : "bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700"
                }
              `
            }
          >
            Registro
          </NavLink>
        </div>
      </nav>

      {/* Content */}
      <main
        className="
          min-h-[calc(100vh-73px)]

          flex items-center justify-center

          p-4
        "
      >
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
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

            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Route>

          {/* App */}
          <Route path="app" element={<AppLayout />}>
            {/* Home */}
            <Route
              index
              element={
                <div className="space-y-4 flex justify-center items-center flex-col">
                  <h1 className="text-5xl font-semibold text-slate-50">
                    Bienvenido
                  </h1>

                  <p className="text-lg text-slate-400">
                    Gestioná clientes, stock y facturación.
                  </p>
                </div>
              }
            />

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

            {/* Catch */}
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>

          {/* Global Catch */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "132238",
            color: "f8fafc",
            border: "1px solid rgba(148,163,184,0.2)",
          },
        }}
        containerStyle={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}

export default App;
