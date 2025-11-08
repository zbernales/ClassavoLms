import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getCourseDetails, 
  getChaptersByCourse,
  getStudentsByCourse,
  removeStudentFromCourse,
  deleteCourse,
  unenrollCourse
} from "./api";
import { Tabs, Tab } from "@mui/material"; 

function CourseDetailPage({ user }) {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState(0); 

  const isInstructor = user?.role === "instructor";
  useEffect(() => {
    if (user === undefined) return; 
    if (!courseId || courseId === "undefined") return; 

    if (user === null) {
        navigate("/login");
        return;
    }

    // ✅ Load course info
    getCourseDetails(courseId)
      .then(res => setCourse(res.data))
      .catch(() => navigate("/my-courses"));

    // ✅ Load chapters filtered by role (backend handles)
    getChaptersByCourse(courseId)
      .then(res => setChapters(res.data))
      .catch(() => setChapters([]));

    // ✅ Load students
    getStudentsByCourse(courseId)
      .then(res => setStudents(res.data))
      .catch(() => setStudents([]));
  }, [courseId, user, navigate]);

  const handleRemoveStudent = (studentId) => {
    removeStudentFromCourse(courseId, studentId)
      .then(() =>
        setStudents(prev => prev.filter(s => s.id !== studentId))
      );
  };

  const handleDeleteCourse = () => {
    deleteCourse(courseId).then(() => navigate("/my-courses"));
  };

  const handleUnenroll = () => {
    unenrollCourse(courseId).then(() => navigate("/my-courses"));
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2>{course.title}</h2>

      <Tabs value={tab} onChange={(e, val) => setTab(val)}>
        <Tab label="Chapters" />
        <Tab label="Students" />
        <Tab label="Settings" />
      </Tabs>

      {/* ✅ CHAPTER TAB */}
      {tab === 0 && (
        <div>
          <h3>Chapters</h3>
          {isInstructor && (
            <button onClick={() => alert("Open Plate.js editor here")}>
              ➕ Create Chapter
            </button>
          )}

          {chapters.length === 0 ? (
            <p>No chapters yet.</p>
          ) : (
            <ul>
              {chapters.map(ch => (
                <li key={ch.id}>
                  <strong>{ch.title}</strong>
                  {!ch.is_public && <span> 🔒 (Private)</span>}
                  
                  {isInstructor && (
                    <>
                      <button style={{ marginLeft: 10 }}>
                        Edit
                      </button>
                      <button style={{ marginLeft: 5 }}>
                        Toggle Visibility
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ✅ STUDENT TAB */}
      {tab === 1 && (
        <div>
          <h3>Students</h3>
          {students.length === 0 ? (
            <p>No students yet.</p>
          ) : (
            <ul>
              {students.map(s => (
                <li key={s.id}>
                  {s.username} ({s.email})
                  {isInstructor && s.id !== user.id && (
                    <button style={{ marginLeft: 10 }} 
                      onClick={() => handleRemoveStudent(s.id)}>
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ✅ SETTINGS TAB */}
      {tab === 2 && (
        <div>
          <h3>Settings</h3>
          {isInstructor ? (
            <button onClick={handleDeleteCourse} style={{ color: "red" }}>
              Delete Course ❌
            </button>
          ) : (
            <button onClick={handleUnenroll} style={{ color: "red" }}>
              Unenroll ❌
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDetailPage;
