import React, { useEffect, useState } from "react";
import axios from "axios";

function TeamMembers({
  designId,
  open,
  onClose,
  onlineUserIds = [],
}) {
  const [members, setMembers] = useState([]);

  const token = localStorage.getItem("token");

  const safeParse = (value) => {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  const decodeToken = (jwt) => {
    try {
      if (!jwt) return {};
      const payload = jwt.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  };

  const storedUser =
    safeParse(localStorage.getItem("user")) ||
    safeParse(localStorage.getItem("userData")) ||
    safeParse(localStorage.getItem("authUser")) ||
    {};

  const tokenUser = decodeToken(token);

  const currentUserId =
    storedUser?.id ||
    storedUser?.user_id ||
    storedUser?._id ||
    storedUser?.user?.id ||
    storedUser?.user?.user_id ||
    tokenUser?.id ||
    tokenUser?.user_id ||
    tokenUser?._id;

  const currentUserEmail =
    storedUser?.email ||
    storedUser?.user?.email ||
    tokenUser?.email ||
    tokenUser?.user?.email;

  const normalize = (value) => String(value || "").trim().toLowerCase();

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isCurrentUser = (member) => {
    const memberUserId = member.user_id || member.id;

    const idMatch =
      currentUserId && String(memberUserId) === String(currentUserId);

    const emailMatch =
      currentUserEmail &&
      normalize(member.email) === normalize(currentUserEmail);

    return idMatch || emailMatch;
  };

  const isOnlineUser = (member) => {
    const memberUserId = member.user_id || member.id;

    return onlineUserIds.map(String).includes(String(memberUserId));
  };

  const loadMembers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5050/api/collaboration/design/${designId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const owner = res.data.owner;
      const collaborators = res.data.collaborators || [];

      const formatted = [
        {
          id: owner?.id,
          user_id: owner?.id,
          name: owner?.name,
          email: owner?.email,
          role: "owner",
          status: "accepted",
        },
        ...collaborators.map((c) => ({
          id: c.id,
          user_id: c.user_id,
          name: c.name || c.email || c.invitee_email,
          email: c.email || c.invitee_email,
          role: c.role,
          status: c.status,
        })),
      ].filter((m) => m.status === "accepted");

      setMembers(formatted);
    } catch (err) {
      console.log("TEAM LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    if (open && designId) {
      loadMembers();
    }
  }, [open, designId]);

  if (!open) return null;

  const membersWithPresence = members.map((m) => ({
    ...m,
    presence: isOnlineUser(m) ? "online" : "away",
  }));

  const onlineMembers = membersWithPresence.filter(
    (m) => m.presence === "online"
  );

  const awayMembers = membersWithPresence.filter(
    (m) => m.presence === "away"
  );

  const renderMember = (m, i, type) => (
    <div
      key={`${type}-${i}`}
      className="editor-role-team-member"
      style={{
        opacity: type === "away" ? 0.45 : 1,
      }}
    >
      <div className="editor-pending-member-left">
        <div style={{ position: "relative" }}>
          <div className="editor-team-panel-avatar">
            {getInitials(m.name || m.email)}
          </div>

          {type === "online" && (
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#22C55E",
                position: "absolute",
                bottom: "0px",
                right: "0px",
                border: "2px solid white",
              }}
            ></span>
          )}
        </div>

        <div>
          <h4>{isCurrentUser(m) ? `${m.name} (you)` : m.name}</h4>
          <p>{m.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="editor-invite-profile-panel">
      <div className="editor-team-profile-header">
        <div>
          <h4>Team</h4>
          <p>{members.length} Members</p>
        </div>

        <button onClick={onClose}>✕</button>
      </div>

      <hr />

      <div className="editor-multipanel-profile-search">
        <input type="text" placeholder="Search Members" />
      </div>

      <div className="editor-multipanel-section-header">
        <p>Online</p>

        <span className="editor-team-profile-online-count">
          {onlineMembers.length}
        </span>
      </div>

      <div className="editor-multipanel-profile-list">
        {onlineMembers.map((m, i) => renderMember(m, i, "online"))}
      </div>

      {awayMembers.length > 0 && (
        <>
          <p className="editor-multipanel-section-title">Away</p>

          <div className="editor-multipanel-profile-list">
            {awayMembers.map((m, i) => renderMember(m, i, "away"))}
          </div>
        </>
      )}
    </div>
  );
}

export default TeamMembers;  