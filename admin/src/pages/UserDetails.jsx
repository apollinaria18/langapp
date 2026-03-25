// UserDetails.jsx (расширенная версия)
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/users.css";

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "U";
  if (nameOrEmail.includes("@")) {
    return nameOrEmail.slice(0, 2).toUpperCase();
  }
  const parts = nameOrEmail.split(" ").filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase();
}

function formatDate(timestamp) {
  if (!timestamp) return "—";
  try {
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return "—";
  }
}

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userScores, setUserScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Получаем данные пользователя из коллекции users
        const userDoc = await getDoc(doc(db, "users", id));
        
        if (!userDoc.exists()) {
          setError("User not found");
          setLoading(false);
          return;
        }
        
        const userData = { id: userDoc.id, ...userDoc.data() };
        setUser(userData);
        
        // Получаем данные о результатах пользователя из коллекции userScores
        const scoresQuery = query(
          collection(db, "userScores"),
          where("userId", "==", id)
        );
        const scoresSnapshot = await getDocs(scoresQuery);
        
        if (!scoresSnapshot.empty) {
          setUserScores(scoresSnapshot.docs[0].data());
        }
        
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="users-page">
        <div className="details-top">
          <Link className="back-link" to="/users">
            ← Back to Users
          </Link>
        </div>
        <div style={{ textAlign: 'center', padding: '60px', color: '#5b6c80' }}>
          Loading user data...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="users-page">
        <div className="details-top">
          <Link className="back-link" to="/users">
            ← Back to Users
          </Link>
        </div>
        <div className="details-card" style={{ marginTop: '32px', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444' }}>{error || "User not found"}</h2>
          <p>User ID: {id}</p>
        </div>
      </div>
    );
  }

  const displayName = user.username || user.email?.split('@')[0] || "User";
  const status = user.status || "active";
  const lessonsCompleted = userScores?.lessonsCompleted || user.lessonsCompleted || 0;
  const streak = userScores?.currentStreak || user.streak || 0;
  const rating = userScores?.averageRating || user.rating || 0;
  const totalPoints = userScores?.totalPoints || 0;
  const joined = user.createdAt || user.joined;
  const lastActive = user.lastActive || user.lastLoginAt;

  return (
    <div className="users-page">
      <div className="details-top">
        <Link className="back-link" to="/users">
          ← Back to Users
        </Link>

        <div className="details-user">
          <div className="avatar big">
            <span>{getInitials(displayName)}</span>
          </div>

          <div>
            <h1 className="details-name">{displayName}</h1>
            <p className="details-email">{user.email || "—"}</p>
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <div className="details-label">Status</div>
          <div className={`details-value status ${status.toLowerCase()}`}>
            {status === "active" ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="details-card">
          <div className="details-label">Joined</div>
          <div className="details-value">{formatDate(joined)}</div>
        </div>

        <div className="details-card">
          <div className="details-label">Last Active</div>
          <div className="details-value">{formatDate(lastActive)}</div>
        </div>

        <div className="details-card">
          <div className="details-label">Lessons Completed</div>
          <div className="details-value">{lessonsCompleted}</div>
        </div>

        <div className="details-card">
          <div className="details-label">Current Streak</div>
          <div className="details-value">{streak} {streak === 1 ? 'day' : 'days'}</div>
        </div>

        <div className="details-card">
          <div className="details-label">Average Rating</div>
          <div className="details-value">{rating} ⭐</div>
        </div>

        {totalPoints > 0 && (
          <div className="details-card">
            <div className="details-label">Total Points</div>
            <div className="details-value">{totalPoints}</div>
          </div>
        )}
      </div>
    </div>
  );
}