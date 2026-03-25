import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebase';
import Login from './auth/Login';
import ForgotPassword from './auth/ForgotPassword';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Content from './pages/Content';
import Feedback from './pages/Feedback';

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AuthenticatedLayout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/content" element={<Content />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
              <AuthenticatedLayout />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}