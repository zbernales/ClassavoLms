import { useState } from "react";
import { createCourse } from "./api";
import { useNavigate } from "react-router-dom";

function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createCourse({ title, description });
      alert("Course created!");
      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    }
  };

  return (
    <div>
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br/>
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br/>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateCoursePage;
