import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import "./Login.css";

const Login = () => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch(`${window.location.origin}/djangoapp/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userName: userName.trim(),
            password,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.status !== "Authenticated") {
        setError(result.error || "The user could not be authenticated.");
        return;
      }
      sessionStorage.setItem('username', result.userName);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (requestError) {
      setError("Unable to reach the sign-in service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <p className="login-eyebrow">Welcome back</p>
        <h1 id="login-title">Sign in</h1>
        <p className="login-intro">Sign in to continue to your dealership account.</p>
        <form className="login-form" onSubmit={login}>
          <label htmlFor="login-username">Username</label>
          <input id="login-username" name="username" type="text" autoComplete="username" value={userName} onChange={(event) => setUserName(event.target.value)} required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Login"}</button>
        </form>
        <p className="login-register">New here? <Link to="/register">Register now</Link></p>
      </section>
    </main>
  );
};

export default Login;
