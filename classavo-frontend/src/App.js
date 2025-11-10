import React, { useEffect, useState } from 'react';
import { Routes, Route, } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "./Login"
import { getCurrentUser } from './api';
import CreateCoursePage from "./CreateCoursePage";
import MyCoursesPage from './MyCoursesPage';
import CourseDetailPage from "./CourseDetailPage";
import Signup  from './Signup';
import CoursesPage from './CoursesPage';
import Navbar from './Navbar';

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
      <Route path="/signup" element={<Signup />} />
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