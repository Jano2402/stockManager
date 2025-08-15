import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

function Logout() {
  const [error, setError] = useState("");

  const doLogout = async () => {
    try {
      await axiosClient.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );

      window.location.href = "/";
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "No estás logueado");
    }
  };

  useEffect(() => {
    doLogout();
  }, []);

  return <>{error && <p style={{ color: "red" }}>{error}</p>}</>;
}

export default Logout;
