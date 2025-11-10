import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Link to="/">Courses</Link> |{" "}
        {user && <Link to="/my-courses">My Courses</Link>} |{" "}
        {user?.role === "instructor" && <Link to="/create-course">Create Course</Link>} |{" "}
        {!user && <Link to="/login">Login</Link>} |{" "}
        {!user && <Link to="/signup">Sign Up</Link>}
      </div>

      {user && (
        <div>
          <span style={{ marginRight: "10px" }}>
            Welcome, {user.first_name} {user.last_name}
          </span>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar