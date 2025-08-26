import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate, Link } from "react-router-dom";
import { LogoutButton } from "../components/LogoutButton";

export const Home = () => {

  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL; // ej: http://127.0.0.1:3001

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrMsg(""); setOkMsg("");

    if (!API) { setErrMsg("VITE_BACKEND_URL no está definido."); return; }
    if (!email || !password) { setErrMsg("Completá email y contraseña."); return; }

    setLoading(true);

    fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password })
    })
      .then((resp) =>
        resp
          .json()
          .catch(() => ({})) // por si la respuesta de error no trae JSON
          .then((data) => ({ ok: resp.ok, data }))
      )
      .then(({ ok, data }) => {
        if (!ok) {
          throw new Error(data?.msg || data?.error || "Credenciales inválidas");
        }
        // guardar token
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        setOkMsg("Sesión iniciada correctamente.");
        // (opcional) redirigir a /demo:
        // navigate("/demo");

        // 🔽 redirigir a /single
        // (ruta estática)
        navigate("/single");

      })
      .catch((err) => setErrMsg(err.message || "Error inesperado"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar sesión</h2>

      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="mb-3 row">
          <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <div className="input-group">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPwd ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
        </div>

        {errMsg && <div className="alert alert-danger py-2">{errMsg}</div>}
        {okMsg && <div className="alert alert-success py-2">{okMsg}</div>}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <Link to="/" className="btn btn-outline-secondary">Cancelar</Link>
          <Link to="/demo" className="btn btn-link">Crear cuenta</Link>
        </div>
      </form>

      <LogoutButton className="btn btn-sm btn-outline-danger ms-2" />

      {/* Botón opcional para probar /api/protected con el token guardado */}
      {/* 
      <button
        className="btn btn-outline-info mt-3"
        onClick={() => {
          const t = localStorage.getItem("token");
          if (!t) { setErrMsg("No hay token guardado."); return; }
          fetch(`${API}/api/protected`, {
            headers: { Authorization: `Bearer ${t}` }
          })
            .then((r) => r.json().catch(() => ({})).then((d) => ({ ok: r.ok, d })))
            .then(({ ok, d }) => {
              if (!ok) throw new Error(d?.msg || "401");
              alert("OK /protected → " + JSON.stringify(d));
            })
            .catch((e) => alert("Error: " + e.message));
        }}
      >
        Probar /api/protected
      </button>
      */}
    </div>
  );
};