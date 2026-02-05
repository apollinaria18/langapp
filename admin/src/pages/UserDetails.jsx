// UserDetails.jsx
import { useParams, Link } from "react-router-dom";
import "../styles/users.css";

const users = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    joined: "2023-01-15",
    lastActive: "2023-10-26",
    status: "Active",
    lessonsCompleted: 86,
    streak: 14,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Bob Williams",
    email: "bob@example.com",
    joined: "2023-02-20",
    lastActive: "2023-10-25",
    status: "Active",
    lessonsCompleted: 41,
    streak: 6,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    joined: "2023-03-10",
    lastActive: "2023-09-01",
    status: "Inactive",
    lessonsCompleted: 12,
    streak: 0,
    rating: 4.1,
  },
];

function getInitials(name) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase();
}

export default function UserDetails() {
  const { id } = useParams();

  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="users-page">
        <h1>User not found</h1>
        <Link className="back-link" to="/users">
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="details-top">
        <Link className="back-link" to="/users">
          ← Back to Users
        </Link>

        <div className="details-user">
          <div className="avatar big">
            <span>{getInitials(user.name)}</span>
          </div>

          <div>
            <h1 className="details-name">{user.name}</h1>
            <p className="details-email">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <div className="details-label">Status</div>
          <div className={`details-value status ${user.status.toLowerCase()}`}>
            {user.status}
          </div>
        </div>

        <div className="details-card">
          <div className="details-label">Joined</div>
          <div className="details-value">{user.joined}</div>
        </div>

        <div className="details-card">
          <div className="details-label">Last Active</div>
          <div className="details-value">{user.lastActive}</div>
        </div>

        <div className="details-card">
          <div className="details-label">Lessons Completed</div>
          <div className="details-value">{user.lessonsCompleted}</div>
        </div>

        <div className="details-card">
          <div className="details-label">Current Streak</div>
          <div className="details-value">{user.streak} days</div>
        </div>

        <div className="details-card">
          <div className="details-label">Average Rating</div>
          <div className="details-value">{user.rating} ⭐</div>
        </div>
      </div>
    </div>
  );
}
