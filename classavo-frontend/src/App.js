import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "./Login"
import { getCourses, joinCourse, getCurrentUser } from './api';
import CreateCoursePage from "./CreateCoursePage";
import MyCoursesPage from './MyCoursesPage';

function CoursesPage({ user }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses()
      .then(response => setCourses(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleJoin = async (courseId) => {
    try {
      const response = await joinCourse(courseId);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Failed to join course");
    }
  };

  return (
    <div>
      <h1>Available Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <strong>{course.title}</strong>: {course.description}
            {user?.role === "student" && <button onClick={() => handleJoin(course.id)}>Join</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Navbar({ user, onLogout }) {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/">Courses</Link> |{" "}
      {user && <Link to="/my-courses">My Courses</Link>}
      {!user && <Link to="/login">Login</Link>}
      {user && <button onClick={onLogout} style={{ marginLeft: "10px" }}>Logout</button>} |{" "}
      {user?.role === "instructor" && <Link to="/create-course">Create Course</Link>}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(err => {
        console.log("No logged in user");
        setUser(null);
      });
  }, []);

  return (
  <>
    <Navbar user={user} onLogout={handleLogout} />
    <Routes>
      <Route path="/" element={<CoursesPage />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      {user?.role === "instructor" && (
        <Route path="/create-course" element={<CreateCoursePage user={user}/>} />
      )}
      <Route path="/my-courses" element={<MyCoursesPage user={user} />} />
    </Routes>
  </>
) ;
}

export default App;