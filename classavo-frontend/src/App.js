import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login"
import { getCourses } from './api';

function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses()
      .then(response => setCourses(response.data))
      .catch(error => console.error(error));
  }, []);


  return (
    <div>
      <h1>Python LMS Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <strong>{course.title}</strong>: {course.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Navbar() {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/">Courses</Link> |{" "}
      <Link to="/login">Login</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home page → shows courses */}
        <Route path="/" element={<CoursesPage />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;