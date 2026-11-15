import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const register = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${window.location.origin}/djangoapp/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        window.alert(result.error || "Registration could not be completed.");
        return;
      }
      if (result.userName) sessionStorage.setItem("username", result.userName);
      window.location.assign("/");
    } catch (error) {
      window.alert("Unable to reach the registration service. Please try again later.");
    }
  };

  return (
    <main className="register-page">
      <section className="register-card" aria-labelledby="register-title">
        <p className="register-eyebrow">Create your account</p>
        <h1 id="register-title">Sign up</h1>
        <p className="register-intro">Join us to get started with your dealership search.</p>
        <form className="register-form" onSubmit={register}>
          <label htmlFor="register-username">Username</label>
          <input id="register-username" name="userName" type="text" autoComplete="username" value={form.userName} onChange={updateField} required />

          <div className="register-name-fields">
            <div>
              <label htmlFor="register-first-name">First Name</label>
              <input id="register-first-name" name="firstName" type="text" autoComplete="given-name" value={form.firstName} onChange={updateField} required />
            </div>
            <div>
              <label htmlFor="register-last-name">Last Name</label>
              <input id="register-last-name" name="lastName" type="text" autoComplete="family-name" value={form.lastName} onChange={updateField} required />
            </div>
          </div>

          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} required />

          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={updateField} required />

          <button className="register-button" type="submit">Register</button>
        </form>
        <p className="register-login">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
};

export default Register;
