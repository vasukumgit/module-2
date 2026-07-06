import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Invite from "./Invite";
import TeamMembers from "./TeamMember";
import Select from "../../../../../assets/editor-panel/select.svg";
import Arrow from "../../../../../assets/editor-panel/arrow.svg";
function CollabrationPanel({ designId, }) {
      const socketRef = useRef(null);
  const [openInvite, setOpenInvite] = useState(false);
  const [openProfilePanel, setOpenProfilePanel] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  // ==========================================
  // UPDATE TITLE WHEN DESIGN LOADS//BE change
  // ==========================================

  useEffect(() => {
    socketRef.current = io("http://localhost:5050");

    socketRef.current.emit("join-design", {
      designId: designId,
    });

    socketRef.current.on("design-saving", (data) => {
      setStatus(data.status);
    });

    socketRef.current.on("design-save-success", (data) => {
      setStatus(data.status);
    });

    socketRef.current.on("design-save-failed", (data) => {
      setStatus(data.status);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [designId]);
//   useEffect(() => {
//     if (design?.name) {
//       setTitle(design.name);
//     }
//   }, [design]);

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

  const token = localStorage.getItem("token");

  const storedUser =
    safeParse(localStorage.getItem("user")) ||
    safeParse(localStorage.getItem("userData")) ||
    safeParse(localStorage.getItem("authUser")) ||
    {};

  const tokenUser = decodeToken(token);

  const currentUser = {
    id:
      storedUser?.id ||
      storedUser?.user_id ||
      storedUser?._id ||
      storedUser?.user?.id ||
      storedUser?.user?.user_id ||
      tokenUser?.id ||
      tokenUser?.user_id ||
      tokenUser?._id,

    name:
      storedUser?.name || storedUser?.user?.name || tokenUser?.name || "User",

    email:
      storedUser?.email || storedUser?.user?.email || tokenUser?.email || "",
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const fetchTeamMembers = async () => {
    try {
      if (!designId) return;

      const res = await axios.get(
        `http://localhost:5050/api/collaboration/design/${designId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const owner = res.data.owner;
      const collaborators = res.data.collaborators || [];

      const formatted = [
        {
          id: owner?.id,
          user_id: owner?.id,
          name: owner?.name || "Owner",
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
      ];

      setTeamMembers(formatted);
    } catch (err) {
      console.log("Error fetching team:", err);
    }
  };

  useEffect(() => {
    if (designId) {
      fetchTeamMembers();
    }
  }, [designId]);

  // MODULE 3 SOCKET ADDED: realtime online/offline
  useEffect(() => {
    if (!currentUser.id || !designId) return;

    const socket = io("http://localhost:5050");

    socket.emit("user-online", currentUser.id);

    socket.emit("join-design", {
      design_id: designId,
      user: currentUser,
    });

    socket.on("online-users", (ids) => {
      setOnlineUserIds(ids.map((id) => String(id)));
    });

    return () => {
      socket.emit("leave-design", {
        design_id: designId,
        user: currentUser,
      });

      socket.disconnect();
    };
  }, [designId, currentUser.id]);
  return (
    <>
      <div
        className="profile-btn"
        onClick={() => setOpenProfilePanel(!openProfilePanel)}
      >
        <ul>
          {teamMembers.slice(0, 3).map((user, index) => (
            <li key={index}>
              <div className="editor-header-avatar">
                {getInitials(user.name || user.email || "U")}
              </div>
            </li>
          ))}
        </ul>
        <p>+{Math.max(teamMembers.length - 3, 0)}</p>
        <img
          src={Arrow}
          alt=""
          className="profile-arrow"
          onClick={() => setOpenProfilePanel(!openProfilePanel)}
        />
      </div>
      <button className="invite-btn" onClick={() => setOpenInvite(true)}>
        <img src={Select} alt="" />
        <span>Invite</span>
      </button>

      <Invite
        open={openInvite}
        onClose={() => setOpenInvite(false)}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        designId={designId}
        refreshTeam={fetchTeamMembers}
      />
      {openProfilePanel && (
        <TeamMembers
          designId={designId}
          open={openProfilePanel}
          onClose={() => setOpenProfilePanel(false)}
          onlineUserIds={onlineUserIds}
        />
      )}
    </>
  );
}

export default CollabrationPanel;
