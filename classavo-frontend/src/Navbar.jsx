import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Courses</Link>
        {user && <Link to="/my-courses">My Courses</Link>}
        {user?.role === "instructor" && <Link to="/create-course">Create Course</Link>}
        {!user && <Link to="/login">Log in</Link>}
        {!user && <Link to="/signup">Sign Up</Link>}
      </div>

      {user && (
        <div className="nav-user">
          <span className="welcome-text">
            Welcome, {user.first_name} {user.last_name}
          </span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
