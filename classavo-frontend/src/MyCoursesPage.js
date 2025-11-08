import { useEffect, useState } from "react";
import { getMyCourses } from "./api";
import { useNavigate } from "react-router-dom";

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

  return (
    <div>
      <h2>
        {user?.role === "instructor" ? "Courses You Teach" : "Courses You're Enrolled In"}
      </h2>

      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <strong>{course.title}</strong> - {course.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCoursesPage;
