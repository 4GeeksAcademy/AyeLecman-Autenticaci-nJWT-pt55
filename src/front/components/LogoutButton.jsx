import React from "react";
import { useNavigate } from "react-router-dom";

export const LogoutButton = ({ className = "btn btn-outline-danger", onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    navigate("/", { replace: true }); 
    if (onLogout) onLogout();
  };

  return (
    <button type="button" className={className} onClick={handleLogout} style={{ border: "none" }}>
      Cerrar sesión
    </button>
  );
};