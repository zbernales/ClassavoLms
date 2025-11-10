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
} from "../api/api";
import { Tabs, Tab } from "@mui/material";
import ChapterEditor from "../components/ChapterEditor"; 
import ChapterViewer from "../components/ChapterViewer";
import "../styles/CourseDetailPage.css";

function CourseDetailPage({ user }) {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState(0);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorValue, setEditorValue] = useState([
    { type: "p", children: [{ text: "" }] },
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
    if (!window.confirm("Are you sure you want to remove this student?")) return;

    removeStudentFromCourse(courseId, studentId)
      .then(() => setStudents(prev => prev.filter(s => s.id !== studentId)));
  };

  const handleDeleteCourse = () => {
    if (!window.confirm("Are you sure you want to permanently delete this course?")) return;
    deleteCourse(courseId).then(() => navigate("/my-courses"));
  };

  const handleUnenroll = () => {
    if (!window.confirm("Are you sure you want to unenroll from this course?")) return;
    unenrollCourse(courseId).then(() => navigate("/my-courses"));
  };

  const handleDeleteChapter = (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    deleteChapter(chapterId)
      .then(() => setChapters(prev => prev.filter(ch => ch.id !== chapterId)))
      .catch(err => console.error("Delete chapter error:", err));
  };
  
  const handleEditChapter = (chapterId) => {
    const payload = {
      title: newChapterTitle,
      content: JSON.stringify(editorValue),
    };

    updateChapter(chapterId, payload)
      .then(res => {
        setChapters(prev => prev.map(ch => ch.id === chapterId ? res.data : ch));
        setEditingChapterId(null);
        setIsEditorOpen(false);
        setNewChapterTitle("");
        setEditorValue([{ type: "p", children: [{ text: "" }] }]);
      })
      .catch(err => console.error("Chapter update error:", err));
  };

  const handleToggleVisibility = (chapterId) => {
    toggleChapterVisibility(chapterId)
      .then(res => {
        setChapters(prev => prev.map(ch => ch.id === chapterId ? { ...ch, is_public: res.data.is_public } : ch));
      })
      .catch(err => console.error("Toggle visibility error:", err));
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="course-detail-container">
      <h2 className="course-title">{course.title}</h2>

      <Tabs value={tab} onChange={(e, val) => setTab(val)} className="course-tabs">
        <Tab label="Chapters" />
        <Tab label="Students" />
        <Tab label="Settings" />
      </Tabs>

      {/* Chapters Tab */}
      {tab === 0 && (
        <div className="tab-content">
          {isInstructor && (
            <button className="btn primary" onClick={() => setIsEditorOpen(true)}>➕ Create Chapter</button>
          )}

          {isEditorOpen && (
            <div className="chapter-editor">
              <input
                type="text"
                placeholder="Chapter title"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                className="input-field"
              />
              <ChapterEditor value={editorValue} onChange={setEditorValue} />
              <div className="editor-buttons">
                <button onClick={() => editingChapterId ? handleEditChapter(editingChapterId) : handleSaveChapter()} className="btn primary">
                  ✅ Save
                </button>
                <button onClick={() => setIsEditorOpen(false)} className="btn secondary">Cancel</button>
              </div>
            </div>
          )}

          {chapters.length === 0 ? (
            <p>No chapters yet.</p>
          ) : (
            <div className="chapters-list">
              {chapters.map(ch => {
                const isExpanded = expandedChapterId === ch.id;
                return (
                  <div key={ch.id} className="chapter-card">
                    <div
                      className="chapter-header"
                      onClick={() => setExpandedChapterId(isExpanded ? null : ch.id)}
                    >
                      <span className="expand-icon">{isExpanded ? "▼" : "▶"}</span>
                      <strong>{ch.title}</strong>
                      {ch.is_public ? (
                        <span className="public-tag"> 🌐 </span>
                      ) : (
                        <span className="private-tag"> 🔒 (Private)</span>
                      )}
                    </div>


                    {isInstructor && (
                      <div className="chapter-actions">
                        <button onClick={() => handleToggleVisibility(ch.id)} className="btn secondary small">
                          Toggle Visibility
                        </button>
                        <button
                          onClick={() => {
                            setEditingChapterId(ch.id);
                            setNewChapterTitle(ch.title);
                            setEditorValue(JSON.parse(ch.content || '[{"type":"p","children":[{"text":""}]}]'));
                            setIsEditorOpen(true);
                          }}
                          className="btn primary small"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDeleteChapter(ch.id)} className="btn danger small">
                          Delete ✖
                        </button>
                      </div>
                    )}


                    {isExpanded && (
                      <div className="chapter-content">
                        <ChapterViewer content={ch.content} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Students Tab */}
      {tab === 1 && (
        <div className="tab-content students-tab">
          {students.length === 0 ? <p>No students enrolled yet.</p> : (
            <ul>
              {students.map(s => (
                <li key={s.id} className="student-item">
                  {s.first_name} {s.last_name} ({s.email})
                  {isInstructor && s.id !== user.id && (
                    <button onClick={() => handleRemoveStudent(s.id)} className="btn danger small">Remove ✖</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 2 && (
        <div className="tab-content">
          {isInstructor ? (
            <button onClick={handleDeleteCourse} className="btn danger">Delete Course ✖</button>
          ) : (
            <button onClick={handleUnenroll} className="btn danger">Unenroll ✖</button>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDetailPage;
