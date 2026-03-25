import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import {
  LayoutGrid,
  Users,
  Folder,
  MessageSquare,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import '../styles/global.css';

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const isActive = path => location.pathname === path;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // После выхода будет автоматический редирект из App.jsx
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile header */}
      <header className="mobile-header">
        <button className="burger" onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
        <span className="mobile-logo">LangApp</span>
        <button 
          onClick={handleLogout} 
          className="mobile-logout"
          disabled={loading}
        >
          <LogOut size={18} />
          <span>{loading ? '...' : 'Exit'}</span>
        </button>
      </header>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-badge">
            <span className="logo-initials">LA</span>
          </div>

          <div className="logo-title">
            <span className="logo-text">LangApp</span>
            <span className="logo-subtext">Admin Panel</span>
          </div>

          <button className="close-btn" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setOpen(false)}>
            <LayoutGrid size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/users" className={isActive('/users') ? 'active' : ''} onClick={() => setOpen(false)}>
            <Users size={20} />
            <span>Users</span>
          </Link>

          <Link to="/content" className={isActive('/content') ? 'active' : ''} onClick={() => setOpen(false)}>
            <Folder size={20} />
            <span>Content</span>
          </Link>

          <Link to="/feedback" className={isActive('/feedback') ? 'active' : ''} onClick={() => setOpen(false)}>
            <MessageSquare size={20} />
            <span>Feedback</span>
          </Link>
        </nav>

        {/* User Info and Logout */}
        <div className="sidebar-footer">
          {user && (
            <div className="user-info">
              <div className="user-email">
                {user.email}
              </div>
              <div className="user-role">
                Administrator
              </div>
            </div>
          )}
          
          <button 
            onClick={handleLogout} 
            className="logout-sidebar-btn"
            disabled={loading}
          >
            <LogOut size={20} />
            <span>{loading ? 'Logging out...' : 'Log out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}