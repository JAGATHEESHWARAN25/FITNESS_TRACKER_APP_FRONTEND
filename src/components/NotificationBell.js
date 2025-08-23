import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationBell.css"; // ✅ Add styling separately

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // make sure you store this at login

  // Fetch notifications
  useEffect(() => {
    if (!userId || !token) return;

    axios
      .get(`http://localhost:8080/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else if (res.data && res.data.notifications) {
          setNotifications(res.data.notifications);
        } else {
          setNotifications([]);
        }
      })
      .catch(() => setNotifications([]));
  }, [userId, token]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Either REMOVE from list after reading:
      // setNotifications((prev) => prev.filter((n) => n.id !== id));

      // ✅ OR Keep but update style:
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Clear all read notifications
  const clearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-bell">
      <button className="bell-button" onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <span className="count">({unreadCount})</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            <>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${n.read ? "read" : "unread"}`}
                  onClick={() => markAsRead(n.id)}
                >
                  {n.message}
                </div>
              ))}
              <button className="clear-btn" onClick={clearRead}>
                Clear Read
              </button>
            </>
          ) : (
            <div className="no-notifications">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
}
