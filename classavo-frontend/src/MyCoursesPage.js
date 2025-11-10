import { useEffect, useState } from "react";
import { getMyCourses } from "./api";
import { useNavigate } from "react-router-dom";
import "./MyCoursesPage.css";

function MyCoursesPage({ user }) {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    getMyCourses()
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, [user, navigate]);

  const goToCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="my-courses-container">
      <h2 className="my-courses-title">
        {user?.role === "instructor" ? "Courses You Teach" : "Courses You're Enrolled In"}
      </h2>

      {courses.length === 0 ? (
        <p className="no-courses">No courses yet.</p>
      ) : (
        <div className="my-courses-grid">
          {courses.map(course => (
            <div
              key={course.id}
              className="my-course-card"
              onClick={() => goToCourse(course.id)}
            >
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCoursesPage;
