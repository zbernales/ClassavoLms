import { useState } from "react";
import { login } from "./api"; // use the login function from api.js
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // for redirecting after login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call the login function from api.js
      const response = await login(username, password);

      console.log("Logged in!", response.data);
      alert("Login successful!");

      // Redirect to the courses page after login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;