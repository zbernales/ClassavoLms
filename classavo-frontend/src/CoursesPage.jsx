import { getCourses, getMyCourses, joinCourse } from './api';
import React, { useEffect, useState } from 'react';
import "./CoursesPage.css";

function CoursesPage({ user }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!user) return;

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

    if (!user) {
    return (
      <div className="courses-container">
        <h1 className="courses-title">Available Courses</h1>
        <p className="login-message">
          Please <strong>Log In</strong> to view and join courses.
        </p>
      </div>
    );
  }
  
  return (
    <div className="courses-container">
      <h1 className="courses-title">Available Courses</h1>
      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <h3 className="course-title">{course.title}</h3>
            <p className="course-instructor">by <em>{course.instructor?.first_name || "Unknown"} {course.instructor?.last_name || ""}</em></p>
            <p className="course-description">{course.description}</p>
            {user?.role === "student" && (
              <button
                onClick={() => handleJoin(course.id)}
                disabled={course.joined}
                className={`join-button ${course.joined ? 'joined' : ''}`}
              >
                {course.joined ? "Joined" : "Join"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
