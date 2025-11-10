import { getCourses, getMyCourses, joinCourse } from './api';
import React, { useEffect, useState } from 'react';

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

export default CoursesPage