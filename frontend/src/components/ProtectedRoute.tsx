import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/auth/me")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="
        min-h-screen

        flex flex-col
        items-center
        justify-center

        gap-4

        bg-[#0B1220]
        text-slate-50
      "
      >
        <div
          className="
          w-8 h-8

          rounded-full

          border-2 border-sky-300/30
          border-t-sky-300

          animate-spin
        "
        />

        <p className="text-sm text-slate-300">Cargando...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
