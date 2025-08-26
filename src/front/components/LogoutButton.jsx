import React from "react";
import { useNavigate } from "react-router-dom";

export const LogoutButton = ({ className = "btn btn-outline-danger" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/"); // o "/" si preferís
  };

  return (
    <button type="button" className={className} onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
};