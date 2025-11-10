import { useState } from "react";
import { createCourse } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/CreateCoursePage.css";

function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse({ title, description });
      alert("Course created!");
      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit} className="create-course-form">
        <div className="form-group">
          <label>Course Title</label>
          <input
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Course Description</label>
          <textarea
            placeholder="Enter course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">Create Course</button>
      </form>
    </div>
  );
}

export default CreateCoursePage;
