import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate, Link } from "react-router-dom";
import { LogoutButton } from "../components/LogoutButton";
import { LoginForm } from "../components/LoginForm.jsx";

export const Home = () => {

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  return (
    <div className="container mt-5">
      {token ? (
        <div className="container mt-5">
          <div className="alert alert-info text-center mb-3">
            <h1>
              You're already logged in! Go to... {" "}
              <Link to="/private" className="alert-link">
                <span style={{ fontSize: "1.2rem" }}>Super Secret Area</span>
              </Link>
            </h1>
          </div>
          <div className="text-end">
            <LogoutButton className="btn btn-sm btn-outline-danger mt-3" onLogout={() => setToken(null)}/>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};