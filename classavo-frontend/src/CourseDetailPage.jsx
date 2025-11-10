import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getCourseDetails, 
  getChaptersByCourse,
  getStudentsByCourse,
  removeStudentFromCourse,
  deleteCourse,
  unenrollCourse,
  createChapter,
  deleteChapter,
  updateChapter,
  toggleChapterVisibility,
} from "./api";
import { Tabs, Tab, fabClasses } from "@mui/material";
import ChapterEditor from "./ChapterEditor"; 
import ChapterViewer from "./ChapterViewer";

function CourseDetailPage({ user }) {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState(0);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorValue, setEditorValue] = useState([
    {
      type: "p",
      children: [{ text: "" }],
    },
  ]);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [expandedChapterId, setExpandedChapterId] = useState(null);

  const isInstructor = user?.role === "instructor";

  useEffect(() => {
    if (!user) return navigate("/login");
    if (!courseId || courseId === "undefined") return;

    getCourseDetails(courseId)
      .then(res => setCourse(res.data))
      .catch(() => navigate("/my-courses"));

    getChaptersByCourse(courseId)
      .then(res => setChapters(res.data))
      .catch(() => setChapters([]));

    getStudentsByCourse(courseId)
      .then(res => setStudents(res.data))
      .catch(() => setStudents([]));

  }, [courseId, user, navigate]);

  const handleSaveChapter = () => {
  const payload = {
    title: newChapterTitle,
    content: JSON.stringify(editorValue), 
    course: courseId,
    is_public: false,
  };

  createChapter(payload)
    .then(res => {
      setChapters(prev => [...prev, res.data]);
      setIsEditorOpen(false);
      setNewChapterTitle("");
      setEditorValue([{ type: "p", children: [{ text: "" }] }]);
    })
    .catch(err => console.error("Chapter create error:", err));
};

  const handleRemoveStudent = (studentId) => {
    if (!window.confirm("Are you sure you want to remove this student from the course?"))
      return;

    removeStudentFromCourse(courseId, studentId)
      .then(() =>
        setStudents(prev => prev.filter(s => s.id !== studentId))
      );
  };

  const handleDeleteCourse = () => {
    if (!window.confirm("Are you sure you want to permanently delete this course? All chapters and data will be removed."))
      return;

    deleteCourse(courseId).then(() => navigate("/my-courses"));
  };

  const handleUnenroll = () => {
    if (!window.confirm("Are you sure you want to unenroll from this course?"))
      return;

    unenrollCourse(courseId).then(() => navigate("/my-courses"));
  };

  const handleDeleteChapter = (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter? This action cannot be undone."))
      return;

    deleteChapter(chapterId)
      .then(() =>
      setChapters(prevChapters =>
        prevChapters.filter(ch => ch.id !== chapterId)
      )
    )
    .catch(err => console.error("Delete chapter error:", err));
  };
  
  const handleEditChapter = (chapterId) => {
    const payload = {
      title: newChapterTitle,
      content: JSON.stringify(editorValue),
    };

    updateChapter(chapterId, payload)
      .then(res => {
        setChapters(prev =>
          prev.map(ch =>
            ch.id === chapterId ? res.data : ch
          )
        );
        setEditingChapterId(null)
        setIsEditorOpen(false);
        setNewChapterTitle("");
        setEditorValue([{ type: "p", children: [{ text: "" }] }]);
      })
      .catch(err => console.error("Chapter update error:", err));
};

  const handleToggleVisibility = (chapterId) => {
    toggleChapterVisibility(chapterId)
      .then(res => {
        setChapters(prevChapters =>
          prevChapters.map(ch =>
            ch.id === chapterId ? { ...ch, is_public: res.data.is_public } : ch
          )
        );
      })
      .catch(err => console.error("Toggle visibility error:", err));
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

      {/* ✅ Chapter Tab */}
      {tab === 0 && (
        <div>
          <h3>Chapters</h3>

          {isInstructor && (
            <button onClick={() => setIsEditorOpen(true)}>
              ➕ Create Chapter
            </button>
          )}

          {isEditorOpen && (
            <div style={{ marginTop: 16, padding: 16, border: "1px solid #ccc" }}>
              <input
                type="text"
                placeholder="Chapter title"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
              />

              <ChapterEditor value={editorValue} onChange={setEditorValue} />

              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() =>
                    editingChapterId
                      ? handleEditChapter(editingChapterId)
                      : handleSaveChapter()
                  }
                  disabled={!newChapterTitle}
                >
                  ✅ Save
                </button>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  style={{ marginLeft: 10 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {chapters.length === 0 ? (
            <p>No chapters yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {chapters.map(ch => {
                const isExpanded = expandedChapterId === ch.id;

                return (
                  <li key={ch.id} style={{ marginBottom: 16, borderBottom: "1px solid #ddd", paddingBottom: 10 }}>
                    <div
                      onClick={() =>
                        setExpandedChapterId(isExpanded ? null : ch.id)
                      }
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <span style={{ marginRight: 8 }}>
                        {isExpanded ? "▼" : "▶"}
                      </span>

                      <strong>{ch.title}</strong>
                      {!ch.is_public && <span> 🔒 (Private)</span>}
                    </div>

                    {isInstructor && (
                      <div style={{ marginTop: 6 }}>
                        <button onClick={() => handleToggleVisibility(ch.id)} style={{ marginRight: 8 }}>
                          Toggle Visibility
                        </button>
                        <button
                          onClick={() => {
                            setEditingChapterId(ch.id);
                            setNewChapterTitle(ch.title);
                            setEditorValue(JSON.parse(ch.content || '[{"type":"p","children":[{"text":""}]}]'));
                            setIsEditorOpen(true);
                          }}
                          style={{ marginRight: 8 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(ch.id)}
                          style={{ color: "red" }}
                        >
                          Delete ❌
                        </button>
                      </div>
                    )}
                    
                    {isExpanded && (
                      <div style={{ marginTop: 12, padding: 12, background: "#fafafa", borderRadius: 6 }}>
                        <ChapterViewer content={ch.content} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

          )}
        </div>
      )}

      {/* Students Tab */}
      {tab === 1 && (
        <div>
          <h3>Students</h3>
          {students.map(s => (
            <li key={s.id}>
              {s.username} ({s.email})
              {isInstructor && s.id !== user.id && (
                <button onClick={() => handleRemoveStudent(s.id)} style = {{ color: "red", marginLeft: 5}}>
                  Remove ❌
                </button>
              )}
            </li>
          ))}
        </div>
      )}

      {/* Settings Tab */}
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
