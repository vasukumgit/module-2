import { useState, useEffect, useCallback } from "react";
import { FiFolder, FiBell } from "react-icons/fi";
import axios from "axios";
import "./Notifications.css";
import Emplty_Notifications from "../../../assets/empty_notification.png";
import settings from "../../../assets/Notification/settings.svg";
import bin from "../../../assets/Notification/bin.svg";
import mark_read from "../../../assets/Notification/mark_read.svg";

function Notifications({ isOverlay, setShowNotification }) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserId = userData?.id || userData?.user_id || userData?._id;

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ show: false, type: "" });
  const [undoData, setUndoData] = useState(null);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error("API Error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5050/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)),
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)),
      );
    }
  };

  const handleSelectMode = () => setSelectMode(true);

  const handleCancelSelect = () => {
    setSelectMode(false);
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getAccessType = (message = "") => {
    const msg = message.toLowerCase();

    if (msg.includes("admin")) return "Admin access";
    if (msg.includes("view")) return "View access";
    if (msg.includes("edit")) return "Edit access";

    return "Edit access";
  };

  const getAccessWord = (message = "") => {
    const msg = message.toLowerCase();

    if (msg.includes("admin")) return "admin";
    if (msg.includes("view")) return "view";
    if (msg.includes("edit")) return "edit";

    return "edit";
  };

  // MODULE 3 ADDED:
  // Pending invite/access-request notification should not be deleted.
  // Normal notifications can be deleted.
  // Accepted/rejected notifications can be deleted.
  const hasPendingRequestSelected = selectedNotifications.some((id) => {
    const notif = notifications.find((n) => n.id === id);

    return (
      notif &&
      (notif.type === "design_invite" || notif.type === "access_request") &&
      (!notif.status || notif.status === "pending")
    );
  });

  const getNotificationText = (notification, currentUserId) => {
    const senderName = notification.sender_name || "Someone";
    const receiverName = notification.receiver_name || "User";
    const project = notification.project_name || "Project";

    switch (notification.type) {
      case "access_request":
        return {
          title: `${senderName} requested you for edit access`,
          action: "Requested edit access",
          project,
        };

      case "design_invite": {
        const accessType = getAccessType(notification.message);

        return {
          title:
            notification.message ||
            `${senderName} requested you for ${getAccessWord(
              notification.message,
            )} access`,
          action: accessType,
          project: notification.project_name || "Design",
        };
      }

      case "access_accepted": {
        const isSender =
          Number(notification.sender_id) === Number(currentUserId);
        const isReceiver =
          Number(notification.user_id) === Number(currentUserId);
        const accessWord = getAccessWord(notification.message);
        const accessType = getAccessType(notification.message);

        if (isReceiver) {
          return {
            title:
              notification.message ||
              `You accepted ${senderName}'s ${accessWord} request`,
            action: "Accepted",
            project,
          };
        }

        if (isSender) {
          return {
            title:
              notification.message ||
              `${receiverName} accepted your ${accessWord} access request`,
            action: "Accepted",
            project,
          };
        }

        return {
          title: notification.message || `${accessType} request accepted`,
          action: "Accepted",
          project,
        };
      }

      case "access_rejected": {
        const isSender =
          Number(notification.sender_id) === Number(currentUserId);
        const isReceiver =
          Number(notification.user_id) === Number(currentUserId);
        const accessWord = getAccessWord(notification.message);
        const accessType = getAccessType(notification.message);

        if (isReceiver) {
          return {
            title:
              notification.message ||
              `You rejected ${senderName}'s ${accessWord} request`,
            action: "Rejected",
            project,
          };
        }

        if (isSender) {
          return {
            title:
              notification.message ||
              `${receiverName} rejected your ${accessWord} access request`,
            action: "Rejected",
            project,
          };
        }

        return {
          title: notification.message || `${accessType} request rejected`,
          action: "Rejected",
          project,
        };
      }

      default:
        return {
          title: notification.message || "Notification",
          action: "",
          project,
        };
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "All") return true;

    if (activeTab === "Requests") {
      return notif.type === "access_request" || notif.type === "design_invite";
    }

    if (activeTab === "Unread") return !notif.is_read;
    return true;
  });

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (hasPendingRequestSelected) {
      alert("Please accept or reject the pending request before deleting it.");
      return;
    }

    try {
      const deletedItems = notifications.filter((n) =>
        selectedNotifications.includes(n.id),
      );

      setUndoData({ type: "delete", data: deletedItems });

      await Promise.all(
        selectedNotifications.map((id) =>
          axios.delete(`http://localhost:5050/api/notifications/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ),
      );

      setNotifications((prev) =>
        prev.filter((n) => !selectedNotifications.includes(n.id)),
      );

      setSelectedNotifications([]);
      setSelectMode(false);
      setToast({ show: true, type: "delete" });

      setTimeout(() => {
        setToast({ show: false, type: "" });
        setUndoData(null);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkSelectedRead = async () => {
    try {
      const unreadItems = notifications.filter((n) =>
        selectedNotifications.includes(n.id),
      );

      setUndoData({ type: "read", data: unreadItems });

      await Promise.all(
        selectedNotifications.map((id) =>
          axios.put(
            `http://localhost:5050/api/notifications/${id}/read`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          ),
        ),
      );

      setNotifications((prev) =>
        prev.map((n) =>
          selectedNotifications.includes(n.id) ? { ...n, is_read: 1 } : n,
        ),
      );

      setSelectedNotifications([]);
      setSelectMode(false);
      setToast({ show: true, type: "read" });

      setTimeout(() => {
        setToast({ show: false, type: "" });
        setUndoData(null);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUndo = () => {
    if (!undoData) return;

    if (undoData.type === "delete") {
      setNotifications((prev) => [...undoData.data, ...prev]);
    }

    if (undoData.type === "read") {
      setNotifications((prev) =>
        prev.map((n) =>
          undoData.data.find((u) => u.id === n.id) ? { ...n, is_read: 0 } : n,
        ),
      );
    }

    setToast({ show: false, type: "" });
    setUndoData(null);
  };

  const getTabMeta = (tab) => {
    const unreadAll = notifications.filter((n) => !n.is_read);

    const unreadRequests = notifications.filter(
      (n) =>
        (n.type === "access_request" || n.type === "design_invite") &&
        !n.is_read,
    );

    if (tab === "All") {
      return { count: unreadAll.length, showCount: true, showDot: false };
    }

    if (tab === "Requests") {
      return {
        count: 0,
        showCount: false,
        showDot: unreadRequests.length > 0,
      };
    }

    if (tab === "Unread") {
      return { count: 0, showCount: false, showDot: false };
    }

    return { count: 0, showCount: false, showDot: false };
  };

  const getIcon = (type) => {
    switch (type) {
      case "access_request":
        return <FiFolder />;

      case "design_invite":
        return <FiFolder />;

      case "access_accepted":
        return <FiBell />;

      case "access_rejected":
        return <FiBell />;

      default:
        return <FiBell />;
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5050/api/notifications/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Accept error:", error);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5050/api/notifications/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  const NotificationContent = () => (
    <>
      <div className="notification-overlay-header">
        <h3 style={{ margin: 0 }}>Notification</h3>

        {!selectMode ? (
          <div className="header-actions">
            {notifications.length > 0 && (
              <button className="select-icon-btn" onClick={handleSelectMode}>
                <div className="figma-checkbox">
                  <span className="checkbox-circle"></span>

                  <svg
                    className="checkbox-tick"
                    viewBox="0 0 12 10"
                    fill="none"
                  >
                    <path
                      d="M2 5L5 8L10 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            )}

            <button className="settings-btn">
              <div className="settings-icon-wrapper">
                <img src={settings} alt="settings" />
              </div>
            </button>
          </div>
        ) : (
          <button className="cancel-btn" onClick={handleCancelSelect}>
            Cancel
          </button>
        )}
      </div>

      <div className="notification-tabs">
        {["All", "Requests", "Unread"].map((tab) => {
          const { count, showCount, showDot } = getTabMeta(tab);

          return (
            <span
              key={tab}
              className={`tab-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}

              {showCount && count > 0 && (
                <span className="notification-badge">{count}</span>
              )}

              {showDot && <span className="request-dot"></span>}
            </span>
          );
        })}
      </div>

      <div className="notifications-list">
        {loading ? (
          <div className="loading-container">Loading...</div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            return (
              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.is_read ? "unread" : "read"
                }`}
              >
                {!notification.is_read && (
                  <span className="notification-dot"></span>
                )}

                {selectMode && (
                  <div
                    className={`custom-checkbox ${
                      selectedNotifications.includes(notification.id)
                        ? "checked"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectNotification(notification.id);
                    }}
                  >
                    <span className="checkbox-circle"></span>

                    <svg
                      className="checkbox-tick"
                      viewBox="0 0 12 10"
                      fill="none"
                    >
                      <path
                        d="M2 5L5 8L10 2"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className="notification-icon"
                  onClick={() =>
                    !selectMode &&
                    !notification.is_read &&
                    handleMarkAsRead(notification.id)
                  }
                >
                  {getIcon(notification.type)}
                </div>

                <div className="notification-content">
                  {(() => {
                    const { title, action, project } = getNotificationText(
                      notification,
                      currentUserId,
                    );

                    const date = formatDate(notification.created_at);

                    const isPendingRequest =
                      (notification.type === "access_request" ||
                        notification.type === "design_invite") &&
                      (!notification.status ||
                        notification.status === "pending");

                    return (
                      <>
                        <h4 className="notification-title">{title}</h4>

                        <div className="notification-meta">
                          <span>{date}</span>
                          <span className="dot"></span>
                          <span>{action}</span>
                          <span className="dot"></span>
                          <span className="project-name">{project}</span>
                        </div>

                        {isPendingRequest && (
                          <div
                            className="request-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() =>
                                handleRejectRequest(notification.id)
                              }
                              className="reject-btn"
                              disabled={selectMode}
                            >
                              Reject
                            </button>

                            <button
                              onClick={() =>
                                handleAcceptRequest(notification.id)
                              }
                              className="accept-btn"
                              disabled={selectMode}
                            >
                              Accept
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-notifications-container">
            <div className="no-notifications-image">
              <img src={Emplty_Notifications} alt="No notifications" />
            </div>

            <div className="no-notifications-content">
              <div className="no-notifications-title">No Notifications</div>
              <div className="no-notifications-subtitle">All clear!</div>
              <div className="no-notifications-description">
                No notifications for now
              </div>
            </div>
          </div>
        )}
      </div>

      {selectMode && (
        <div className="notification-actions">
          <label
            className="selectall"
            onClick={(e) => {
              e.preventDefault();
              handleSelectAll();
            }}
          >
            <div
              className={`custom-checkbox ${
                selectedNotifications.length === filteredNotifications.length &&
                filteredNotifications.length > 0
                  ? "checked"
                  : ""
              }`}
              onClick={handleSelectAll}
            >
              <span className="checkbox-circle"></span>

              <svg className="checkbox-tick" viewBox="0 0 12 10" fill="none">
                <path
                  d="M2 5L5 8L10 2"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="select">Select all</span>
          </label>

          <div className="actions-right">
            <button className="mark-read-btn" onClick={handleMarkSelectedRead}>
              <svg className="mark-read-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L20 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>Mark Read</span>
            </button>

            {/* MODULE 3 UPDATED:
                Normal notifications can delete.
                Accepted/rejected notifications can delete.
                Pending design_invite/access_request cannot delete. */}
            <button
              className="delete-btn"
              onClick={handleDeleteSelected}
              disabled={hasPendingRequestSelected}
              style={{
                opacity: hasPendingRequestSelected ? 0.5 : 1,
                cursor: hasPendingRequestSelected ? "not-allowed" : "pointer",
              }}
              title={
                hasPendingRequestSelected
                  ? "Accept or reject pending request before deleting"
                  : "Delete selected notifications"
              }
            >
              <img src={bin} alt="" />
            </button>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="toast-container">
          <div
            className={`toast ${toast.type === "delete" ? "toast-delete" : ""}`}
          >
            <div className="toast-content">
              <img
                src={toast.type === "delete" ? bin : mark_read}
                alt=""
                className="toast-icon"
              />

              <span>
                {toast.type === "delete"
                  ? "Successfully cleared."
                  : "Notification marked as read."}
              </span>
            </div>

            <button onClick={handleUndo}>Undo</button>
          </div>
        </div>
      )}
    </>
  );

  if (isOverlay) {
    return (
      <div
        className="notification-overlay"
        onClick={() => setShowNotification(false)}
      >
        <div
          className="notification-overlay-content"
          onClick={(e) => e.stopPropagation()}
        >
          <NotificationContent />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="notification-full-page-container">
        <NotificationContent />
      </div>
    </div>
  );
}

export default Notifications;
