import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import useGlobalReducer from "../hooks/useGlobalReducer";
import React, { useEffect, useState } from "react";
import helloGif from "../assets/gatito.gif";
import loginGif from "../assets/gatitologin.gif";
import { LogoutButton } from "../components/LogoutButton";

// Define and export the Single component which displays individual item details.
export const Private = () => {
  const API = import.meta.env.VITE_BACKEND_URL;
  const [name] = useState(localStorage.getItem("user_name") || "");
  const authed = !!localStorage.getItem("token");

  return (
    <div className="container text-center mt-5">
      <h1>¡HELLO {authed ? (name || "Friend") : "Friend, you must log in"}!</h1>
      <div className="d-flex justify-content-center mt-5">
        <img
          src={authed ? helloGif : loginGif}
          alt="saludo animado"
          className="img-fluid rounded-3 shadow-sm"
          style={{ maxWidth: 260, height: "auto" }}
        />
      </div>

      {authed ? (
        <div className="text-end">
          <LogoutButton className="btn btn-sm btn-outline-danger mt-5" />
        </div>
      ) : (
        <div className="d-flex gap-2 mt-5 justify-content-end">
          <Link
            to="/signup"
            className="btn btn-sm btn-outline-warning mt-3"
            style={{ border: "none" }}
          >
            Create User
          </Link>
          <Link
            to="/"
            className="btn btn-sm btn-outline-primary mt-3"
            style={{ border: "none" }}
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  )};