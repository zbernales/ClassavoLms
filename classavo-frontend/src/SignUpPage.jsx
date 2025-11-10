import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "./api"; 

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "student", 
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, password, first_name, last_name, email, role } = formData;
    if (!username || !password || !first_name || !last_name || !email || !role) {
      setError("All fields are required.");
      return;
    }

    try {
      await signUpUser(formData);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: "100%" }}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: "10px", width: "100%" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
