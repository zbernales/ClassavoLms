import { useState } from "react";
import { login, getCurrentUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; 

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      const userRes = await getCurrentUser();
      setUser(userRes.data);

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Welcome Back</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
