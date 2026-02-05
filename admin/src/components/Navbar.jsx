import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>LangApp Admin</h2>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/content">Content</Link>
        <Link to="/feedback">Feedback</Link>
      </div>
    </nav>
  );
}
