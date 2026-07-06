import React, { useState } from "react";
import axios from "axios";
import "../header.css";
import DownArrow from "../../../../../assets/editor-panel/downarrow.svg";
import Invitechain from "../../../../../assets/editor-panel/copyinvitelink.svg";
import Lock from "../../../../../assets/editor-panel/lock.svg";
import User from "../../../../../assets/editor-panel/user.png";

function Invite({
  open,
  onClose,
  teamMembers,
  setTeamMembers,
  designId,
  refreshTeam,
}) {
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [role, setRole] = useState("editor");
  const [email, setEmail] = useState("");

  const [openMemberDropdown, setOpenMemberDropdown] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [skipPopupUsers, setSkipPopupUsers] = useState({});

  // FRONTEND TEAM NEW WORK - KEPT AS IT IS
  const [openAccessDropdown, setOpenAccessDropdown] = useState(false);
  const [accessType, setAccessType] = useState("Invited only");

  const token = localStorage.getItem("token");

  // MODULE 3 FIX ADDED:
  // This safely reads logged-in user from localStorage/JWT.
  // Used only to show "(you)" for the actual logged-in user.
  const safeParse = (value) => {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  // MODULE 3 FIX ADDED:
  // Decode JWT also because some login flows may not store user object.
  const decodeToken = (jwt) => {
    try {
      if (!jwt) return {};
      const payload = jwt.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return {};
    }
  };

  // MODULE 3 FIX ADDED:
  // Supports different storage names used in previous modules.
  const storedUser =
    safeParse(localStorage.getItem("user")) ||
    safeParse(localStorage.getItem("userData")) ||
    safeParse(localStorage.getItem("authUser")) ||
    {};

  const tokenUser = decodeToken(token);

  // MODULE 3 FIX ADDED:
  // Current logged-in user identity.
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

  const normalize = (value) =>
    String(value || "").trim().toLowerCase();

  // MODULE 3 FIX ADDED:
  // This replaces old wrong check: user.role === "owner".
  // Now "(you)" shows only for actual logged-in user.
  const isCurrentUser = (user) => {
    const memberUserId = user.user_id || user.id;

    const idMatch =
      currentUserId &&
      String(memberUserId) === String(currentUserId);

    const emailMatch =
      currentUserEmail &&
      normalize(user.email) === normalize(currentUserEmail);

    return idMatch || emailMatch;
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (value) => {
    if (value === "owner") return "Owner";
    if (value === "admin") return "Admin";
    if (value === "editor") return "Edit";
    if (value === "viewer") return "View";
    if (value === "remove") return "Remove";
    return value;
  };

  if (!open) return null;

  // ================= INVITE =================

  const handleInvite = async () => {
    try {
      if (!email) {
        alert("Enter Email");
        return;
      }

      if (!designId) {
        alert("Design ID Missing");
        return;
      }

      await axios.post(
        "http://localhost:5050/api/collaboration/invite",
        {
          design_id: designId,
          email,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await refreshTeam();

      setEmail("");

      alert("Invite Sent Successfully");
    } catch (err) {
      console.log("INVITE ERROR:", err);

      alert(err?.response?.data?.message || "Invite Failed");
    }
  };

  // ================= ROLE CHANGE POPUP =================

  const handleRoleUpdate = async (user, newRole) => {
    if (!user) return;

    if (user.role === "owner") {
      alert("Owner role cannot be changed");
      return;
    }

    if (skipPopupUsers[user.email] && newRole !== "remove") {
      await updateRoleInDB(user, newRole);
      setOpenMemberDropdown(null);
      return;
    }

    setSelectedUser(user);
    setSelectedRole(newRole);
    setShowConfirmPopup(true);
    setOpenMemberDropdown(null);
  };

  // ================= UPDATE ROLE IN DB =================

  const updateRoleInDB = async (user, newRole) => {
    try {
      await axios.put(
        "http://localhost:5050/api/collaboration/role",
        {
          collab_id: user.id,
          role: newRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await refreshTeam();
    } catch (err) {
      console.log("ROLE UPDATE ERROR:", err);
      alert(err?.response?.data?.message || "Role update failed");
    }
  };

  // ================= REMOVE USER FROM DB =================

  const removeUserFromDB = async (user) => {
    try {
      await axios.delete(
        `http://localhost:5050/api/collaboration/remove/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await refreshTeam();
    } catch (err) {
      console.log("REMOVE ERROR:", err);
      alert(err?.response?.data?.message || "Remove failed");
    }
  };

  // ================= CONFIRM CHANGE =================

  const confirmRoleChange = async () => {
    try {
      if (!selectedUser) return;

      if (selectedRole === "remove") {
        await removeUserFromDB(selectedUser);

        setShowConfirmPopup(false);
        setSelectedUser(null);
        setSelectedRole("");
        setDontShowAgain(false);
        return;
      }

      await updateRoleInDB(selectedUser, selectedRole);

      if (dontShowAgain) {
        setSkipPopupUsers((prev) => ({
          ...prev,
          [selectedUser.email]: true,
        }));
      }

      setShowConfirmPopup(false);
      setSelectedUser(null);
      setSelectedRole("");
      setDontShowAgain(false);
    } catch (err) {
      console.log("CONFIRM ROLE ERROR:", err);
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="editor-invite-box">
      <h3>Share & Collaborate</h3>

      <button className="share-collaborate-close-btn" onClick={onClose}>
        ✕
      </button>

      <hr />

      <div className="editor-scroll-content">
        {/* INPUT */}
        <div className="editor-container-invite-button">
          <div className="editor-email-invite">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* ROLE */}
            <div className="editor-role-dropdown">
              <button
                className="editor-admin-button"
                onClick={() => setOpenRoleDropdown(!openRoleDropdown)}
              >
                {getRoleLabel(role)}

                <img src={DownArrow} alt="" />
              </button>

              {openRoleDropdown && (
                <ul className="editor-dropdown-menu">
                  {[
                    {
                      label: "Admin",
                      value: "admin",
                    },
                    {
                      label: "Edit",
                      value: "editor",
                    },
                    {
                      label: "View",
                      value: "viewer",
                    },
                  ].map((item) => (
                    <li
                      key={item.value}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setRole(item.value);
                        setOpenRoleDropdown(false);
                      }}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* INVITE */}
          <button
            className={`editor-invite-button ${email ? "active" : ""}`}
            disabled={!email}
            onClick={handleInvite}
          >
            Invite
          </button>
        </div>

        {/* TEAM */}
        <div style={{ marginTop: "25px" }}>
          <div className="editor-team-header">
            <h4>Team Members</h4>

            <span className="editor-member-team-count">
              {teamMembers.length}
            </span>
          </div>

          {teamMembers.map((user, index) => (
            <div key={index} className="editor-role-team-member">
              <div className="editor-pending-member-left">
                {/* MODULE 3 UPDATED:
    Use initials avatar like TeamMembers.jsx.
    Future ready for profile_image support. */}

<div className="editor-team-panel-avatar">
  {user.profile_image ? (
    <img
      src={user.profile_image}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "#E8EEF9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "600",
        color: "#1D4ED8",
        fontSize: "14px",
      }}
    >
      {getInitials(user.name || user.email)}
    </div>
  )}
</div>

                <div>
                  <h4>
                    {/* MODULE 3 FIX UPDATED:
                        Do not use role === owner.
                        Show "(you)" only for actual logged-in user. */}
                    {isCurrentUser(user)
                      ? `${user.name} (you)`
                      : user.name}
                  </h4>

                  {user.status === "pending" ? (
                    <p>Pending invite</p>
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>
              </div>

              <div
                className="editor-role-member-role"
                style={{ position: "relative" }}
              >
                <span
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  {getRoleLabel(user.role)}
                </span>

                {/* OWNER SHOULD NOT CHANGE */}
                {user.role !== "owner" && (
                  <img
                    src={DownArrow}
                    alt=""
                    onClick={() =>
                      setOpenMemberDropdown(
                        openMemberDropdown === index ? null : index
                      )
                    }
                  />
                )}

                {/* DROPDOWN */}
                {openMemberDropdown === index && (
                  <ul className="editor-dropdown-menu">
                    {[
                      {
                        label: "Admin",
                        value: "admin",
                      },
                      {
                        label: "Edit",
                        value: "editor",
                      },
                      {
                        label: "View",
                        value: "viewer",
                      },
                      {
                        label: "Remove",
                        value: "remove",
                      },
                    ].map((item) => (
                      <li
                        key={item.value}
                        onClick={() => handleRoleUpdate(user, item.value)}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr />

      <div className="editor-footer-button">
        <button className="edit-copy-invite-link">
          <img src={Invitechain} alt="" className="invite-svg-invite" />
          copy invite link
        </button>

        {/* FRONTEND TEAM NEW WORK - KEPT */}
        <button
          className="edit-invited-only"
          onClick={() =>
            setOpenAccessDropdown(
              !openAccessDropdown
            )
          }
        >
          <img
            src={Lock}
            alt=""
            className="invite-svg-invite"
          />

          {accessType}

          <img
            src={DownArrow}
            alt=""
          />
        </button>

        {/* FRONTEND TEAM NEW WORK - KEPT */}
        {openAccessDropdown && (
          <ul className="editor-access-dropdown">
            <li
              onClick={() => {
                setAccessType(
                  "Invited only"
                );

                setOpenAccessDropdown(
                  false
                );
              }}
            >
              Invited only
            </li>

            <li
              onClick={() => {
                setAccessType("Anyone");

                setOpenAccessDropdown(
                  false
                );
              }}
            >
              Anyone
            </li>
          </ul>
        )}

        {/* <button className="edit-invited-only">
          <img src={Lock} alt="" className="invite-svg-invite" />
          invited only
          <img src={DownArrow} alt="" />
        </button> */}
      </div>

      {showConfirmPopup && (
        <div className="editor-popup-overlay">
          <div className="editor-confirm-popup">
            <h3>{selectedRole === "remove" ? "Remove Member" : "Change Role"}</h3>

            <p>
              {selectedRole === "remove" ? (
                <>
                  Are you sure you want to remove{" "}
                  <strong>{selectedUser?.name}</strong>?
                </>
              ) : (
                <>
                  Are you sure you want to change{" "}
                  <strong>{selectedUser?.name}</strong>'s role to{" "}
                  <strong>{getRoleLabel(selectedRole)}</strong>?
                </>
              )}
            </p>

            {selectedRole !== "remove" && (
              <label className="editor-checkbox-row">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                Don't show again
              </label>
            )}

            <div className="editor-popup-buttons">
              <button
                className="editor-popup-cancel"
                onClick={() => {
                  setShowConfirmPopup(false);
                  setSelectedUser(null);
                  setSelectedRole("");
                  setDontShowAgain(false);
                }}
              >
                Cancel
              </button>

              <button
                className="editor-popup-confirm"
                onClick={confirmRoleChange}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invite;