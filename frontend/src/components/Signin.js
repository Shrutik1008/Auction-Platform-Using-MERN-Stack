import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/Signin`, // ✅ ENV BASED URL
        { username, password }
      );

      if (res.data.token) {
        // ✅ Store token
        localStorage.setItem("token", res.data.token);

        // ✅ Notify app instantly (no refresh needed)
        window.dispatchEvent(new Event("auth-change"));

        // ✅ Redirect
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <h2>Signin</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSignin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Signin</button>
      </form>
    </div>
  );
}

export default Signin;
