import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate, Link } from "react-router-dom";
import { LogoutButton } from "../components/LogoutButton";

export const LoginForm = () => {

    const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL; 
    
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
        if (!email || !password) { setErrMsg("Complete email and password"); return; }

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
                    throw new Error(data?.msg || data?.error || "not valid credentials");
                }
                // guardar token
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user_id", data.user_id);
                if (data.user) {
                    const name = data.user.firstname || data.user.username || data.user.email;
                    localStorage.setItem("user_name", name);
                }
                setOkMsg("Sesión iniciada correctamente.");
                // (opcional) redirigir a /demo:
                // navigate("/demo");

                // 🔽 redirigir a /single
                // (ruta estática)
                navigate("/private");

            })
            .catch((err) => setErrMsg(err.message || "unexpected error"))
            .finally(() => setLoading(false));
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-5">Sign in here!</h1>

            <form className="mt-3" onSubmit={handleSubmit}>
                <div className="mb-3 row">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="your@email.com"
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
                                {showPwd ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                </div>

                {errMsg && <div className="alert alert-danger py-2">{errMsg}</div>}
                {okMsg && <div className="alert alert-success py-2">{okMsg}</div>}

                <div className="d-flex gap-2 mt-5 justify-content-center">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Entering..." : "Sign in"}
                    </button>
                    <Link to="/" className="btn btn-outline-secondary">Cancel</Link>

                </div>
            </form>

            <div className="d-flex gap-2 mt-5 justify-content-end">
                <Link to="/signup" className="btn btn-sm btn-outline-warning mt-3" style={{ border: "none" }}>Create User</Link>
            </div>

        </div>
    );
};