import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "./Login"
import { getCourses, getMyCourses, joinCourse, getCurrentUser } from './api';
import CreateCoursePage from "./CreateCoursePage";
import MyCoursesPage from './MyCoursesPage';
import CourseDetailPage from "./CourseDetailPage";
import SignUpPage  from './SignUpPage';

function CoursesPage({ user }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Fetch all courses and the courses the student has joined
    Promise.all([getCourses(), getMyCourses()])
      .then(([allRes, myRes]) => {
        const myCourseIds = myRes.data.map(c => c.id);
        const coursesWithJoined = allRes.data.map(course => ({
          ...course,
          joined: myCourseIds.includes(course.id)
        }));
        setCourses(coursesWithJoined);
      })
      .catch(error => console.error(error));
  }, [user]);

  const handleJoin = async (courseId) => {
    try {
      const response = await joinCourse(courseId);
      alert(response.data.message);
      setCourses(prev =>
        prev.map(course =>
          course.id === courseId ? { ...course, joined: true } : course
        )
      );
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
          <li key={course.id} style={{ marginBottom: "10px" }}>
            <strong>{course.title}</strong> by <em>{course.instructor?.username || "Unknown"}</em>: {course.description}
            {user?.role === "student" && (
              <button
                onClick={() => handleJoin(course.id)}
                disabled={course.joined}
                style={{ marginLeft: "10px" }}
              >
                {course.joined ? "Joined" : "Join"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


function Navbar({ user, onLogout }) {
  return (
    <nav style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Link to="/">Courses</Link> |{" "}
        {user && <Link to="/my-courses">My Courses</Link>} |{" "}
        {user?.role === "instructor" && <Link to="/create-course">Create Course</Link>} |{" "}
        {!user && <Link to="/login">Login</Link>} |{" "}
        {!user && <Link to="/signup">Sign Up</Link>}
      </div>

      {user && (
        <div>
          <span style={{ marginRight: "10px" }}>
            Welcome, {user.first_name} {user.last_name}
          </span>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
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
      <Route path="/" element={<CoursesPage user={user} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/signup" element={<SignUpPage />} />
      {user?.role === "instructor" && (
        <Route path="/create-course" element={<CreateCoursePage user={user}/>} />
      )}
      <Route path="/my-courses" element={<MyCoursesPage user={user} />} />
      <Route path="/courses/:id" element={<CourseDetailPage user={user}/>} />
    </Routes>
  </>
) ;
}

export default App;