// Users.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/users.css";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebase"; 

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "U";
  const parts = nameOrEmail.split(" ").filter(Boolean);

  // если это email
  if (nameOrEmail.includes("@")) {
    return nameOrEmail.slice(0, 2).toUpperCase();
  }

  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase();
}

function formatDate(ts) {
  if (!ts) return "—";
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  } catch {
    return "—";
  }
}

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // users коллекция из Firestore
    // сортировка по createdAt (новые сверху)
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id, // uid
        ...doc.data(),
      }));
      setUsers(list);
    });

    return () => unsub();
  }, []);

  const filteredUsers = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return users;

    return users.filter((u) => {
      const email = (u.email || "").toLowerCase();
      const username = (u.username || "").toLowerCase();
      return email.includes(s) || username.includes(s);
    });
  }, [users, search]);

  return (
    <div className="users-page">
      <div className="users-head">
        <div>
          <h1>Users</h1>
          <p className="users-subtitle">
            Registered users from Firebase (Firestore).
          </p>
        </div>

        <input
          className="users-search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => {
              const displayName = user.username || user.email || "User";

              return (
                <tr
                  key={user.id}
                  className="user-row"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <td>
                    <div className="user-cell">
                      <div className="avatar">
                        <span>{getInitials(displayName)}</span>
                      </div>

                      <div className="user-info">
                        <div className="user-name">{displayName}</div>
                        <div className="user-email">{user.email || "—"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="muted">{formatDate(user.createdAt)}</td>

                  <td>
                    <span className="status active">Active</span>
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={3} className="empty">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="users-hint">
        Tip: Click on a user to open details.
      </p>
    </div>
  );
}
