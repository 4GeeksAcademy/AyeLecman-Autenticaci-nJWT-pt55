import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import PropTypes from "prop-types";  // To define prop types for this component
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import React, { useEffect, useState } from "react";
import helloGif from "../assets/gatito.gif";
import { LogoutButton } from "../components/LogoutButton";

// Define and export the Single component which displays individual item details.
export const Single = () => {
  const API = import.meta.env.VITE_BACKEND_URL;
  const [name, setName] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    if (!id || !token || !API) return;

    fetch(`${API}/api/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json().catch(() => ({})).then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) setName(d.firstname || d.username || d.email);
      })
      .catch(() => { });
  }, []);

  return (
    <div className="text-center mt-5">
      <h1>¡HOLA {name || "AMIGO"}!</h1>
      <div className="d-flex justify-content-center mt-3">
        <img
          src={helloGif}
          alt="saludo animado"
          className="img-fluid rounded-3 shadow-sm"
          style={{ maxWidth: 260, height: "auto" }}
        />
      </div>
      <LogoutButton className="btn btn-sm btn-outline-danger ms-2" />
    </div>
  );
};
