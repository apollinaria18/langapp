import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <h2>LangApp Admin</h2>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/content">Content</Link>
        <Link to="/feedback">Feedback</Link>
      </div>
      <button 
        onClick={handleLogout} 
        className="logout-button"
        disabled={loading}
      >
        <LogOut size={18} />
        <span>{loading ? 'Logging out...' : 'Log out'}</span>
      </button>
    </nav>
  );
}