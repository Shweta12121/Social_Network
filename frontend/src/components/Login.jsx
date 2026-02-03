import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("login/", { email, password });
      localStorage.setItem("access", res.data.access);
      
      navigate("/profile");
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Social Network Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-footer">
          Do'nt have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;