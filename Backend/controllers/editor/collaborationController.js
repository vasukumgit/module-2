const db = require("../../config/db");
const crypto = require("crypto");

// ─────────────────────────────────────────────
// HELPER: role text for notification message
// MODULE 3 UPDATED: supports admin, editor, viewer
// ─────────────────────────────────────────────
const getAccessText = (role) => {
  if (role === "admin") return "admin";
  if (role === "editor") return "edit";
  if (role === "viewer") return "view";
  return "edit";
};

// ─────────────────────────────────────────────
// HELPER: check current user's role in this design
// owner comes from designs.user_id
// admin/editor/viewer comes from editor_collaborators
// ─────────────────────────────────────────────
const getDesignRole = async (design_id, user_id) => {
  const [design] = await db.execute(
    "SELECT user_id FROM designs WHERE id = ?",
    [design_id]
  );

  if (!design.length) return null;

  if (Number(design[0].user_id) === Number(user_id)) {
    return "owner";
  }

  const [collab] = await db.execute(
    `SELECT role
     FROM editor_collaborators
     WHERE design_id = ?
     AND user_id = ?
     AND status = 'accepted'`,
    [design_id, user_id]
  );

  return collab.length ? collab[0].role : null;
};

// ─────────────────────────────────────────────
// 1. SEND INVITE
// MODULE 3 UPDATED:
// - owner only can invite
// - allowed roles: admin, editor, viewer
// - notification message uses sender name dynamically
// ─────────────────────────────────────────────
exports.sendInvite = async (req, res) => {
  try {
    const { design_id, email, role } = req.body;
    const invited_by = req.user.id;

    const allowedRoles = ["admin", "editor", "viewer"];

    if (!design_id || !email || !role) {
      return res.status(400).json({
        message: "design_id, email and role required",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const currentUserRole = await getDesignRole(design_id, invited_by);

    if (currentUserRole !== "owner") {
      return res.status(403).json({
        message: "Only owner can invite collaborators",
      });
    }

    const [userRows] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (!userRows.length) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const [existing] = await db.execute(
      `SELECT id
       FROM editor_collaborators
       WHERE design_id = ?
       AND invitee_email = ?
       AND status IN ('pending', 'accepted')`,
      [design_id, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "User already invited",
      });
    }

    const [senderRows] = await db.execute(
      "SELECT name FROM users WHERE id = ?",
      [invited_by]
    );

    const senderName = senderRows[0]?.name || "Someone";
    const invite_token = crypto.randomBytes(32).toString("hex");
    const token_expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.execute(
      `INSERT INTO editor_collaborators
      (
        design_id,
        invited_by,
        invitee_email,
        role,
        invite_token,
        token_expiry
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [design_id, invited_by, email, role, invite_token, token_expiry]
    );

    await db.execute(
      `INSERT INTO notifications
      (
        user_id,
        type,
        reference_id,
        message,
        sender_id,
        status,
        link
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userRows[0].id,
        "design_invite",
        design_id,
        `${senderName} requested you for ${getAccessText(role)} access`,
        invited_by,
        "pending",
        `/invite/accept?token=${invite_token}`,
      ]
    );

    const inviteLink = `http://localhost:5173/invite/accept?token=${invite_token}`;

    return res.json({
      success: true,
      inviteLink,
    });
  } catch (err) {
    console.error("sendInvite error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// 2. ACCEPT INVITE
// MODULE 3 UPDATED:
// - accepted collaborator gets user_id stored
// - invite token removed
// - owner gets accepted notification
// ─────────────────────────────────────────────
exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Token required",
      });
    }

    const [rows] = await db.execute(
      `SELECT *
       FROM editor_collaborators
       WHERE invite_token = ?`,
      [token]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Invalid invite link",
      });
    }

    const invite = rows[0];

    const [userRows] = await db.execute(
      "SELECT id, name FROM users WHERE email = ?",
      [invite.invitee_email]
    );

    if (!userRows.length) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user_id = userRows[0].id;
    const userName = userRows[0].name || invite.invitee_email;

    await db.execute(
      `UPDATE editor_collaborators
       SET status = 'accepted',
           user_id = ?,
           accepted_at = NOW(),
           invite_token = NULL
       WHERE id = ?`,
      [user_id, invite.id]
    );

    await db.execute(
      `UPDATE notifications
       SET status = 'accepted',
           is_read = 1
       WHERE reference_id = ?
       AND user_id = ?
       AND type = 'design_invite'`,
      [invite.design_id, user_id]
    );

    await db.execute(
      `INSERT INTO notifications
      (
        user_id,
        type,
        reference_id,
        message,
        sender_id,
        status,
        is_read
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        invite.invited_by,
        "access_accepted",
        invite.design_id,
        `${userName} accepted your ${getAccessText(invite.role)} access request`,
        user_id,
        "accepted",
        0,
      ]
    );

    return res.json({
      success: true,
      message: "Invite accepted",
    });
  } catch (err) {
    console.error("acceptInvite error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// 3. DECLINE INVITE
// MODULE 3 UPDATED:
// - rejected invite is removed from editor_collaborators
// - owner gets rejected notification
// ─────────────────────────────────────────────
exports.declineInvite = async (req, res) => {
  try {
    const { token } = req.query;

    const [rows] = await db.execute(
      `SELECT *
       FROM editor_collaborators
       WHERE invite_token = ?`,
      [token]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Invalid token",
      });
    }

    const invite = rows[0];

    const [userRows] = await db.execute(
      "SELECT id, name FROM users WHERE email = ?",
      [invite.invitee_email]
    );

    const user_id = userRows[0]?.id;
    const userName = userRows[0]?.name || invite.invitee_email;

    await db.execute(
      `DELETE FROM editor_collaborators
       WHERE id = ?`,
      [invite.id]
    );

    await db.execute(
      `UPDATE notifications
       SET status = 'rejected',
           is_read = 1
       WHERE reference_id = ?
       AND type = 'design_invite'`,
      [invite.design_id]
    );

    await db.execute(
      `INSERT INTO notifications
      (
        user_id,
        type,
        reference_id,
        message,
        sender_id,
        status,
        is_read
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        invite.invited_by,
        "access_rejected",
        invite.design_id,
        `${userName} rejected your ${getAccessText(invite.role)} access request`,
        user_id || invite.invited_by,
        "rejected",
        0,
      ]
    );

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("declineInvite error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// 4. GET COLLABORATORS
// ROUTE NAME:
// GET /api/collaboration/design/:design_id
//
// IMPORTANT:
// This is the "get collaboration/team members" API.
// Your route imports this function as getCollaborators.
//
// MODULE 3 FIX:
// - added ec.user_id
// - frontend TeamMember.jsx needs user_id to identify current logged-in user
// - without user_id Vikram/abt online detection can fail
// ─────────────────────────────────────────────
exports.getCollaborators = async (req, res) => {
  try {
    const { design_id } = req.params;

    const [ownerRows] = await db.execute(
      `SELECT
        u.id,
        u.name,
        u.email
       FROM designs d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`,
      [design_id]
    );

    const [collaborators] = await db.execute(
      `SELECT
        ec.id,
        ec.user_id,
        ec.design_id,
        ec.role,
        ec.status,
        ec.invitee_email,
        u.name,
        u.email
      FROM editor_collaborators ec
      LEFT JOIN users u ON ec.user_id = u.id
      WHERE ec.design_id = ?
      ORDER BY ec.id DESC`,
      [design_id]
    );

    return res.json({
      success: true,
      owner: ownerRows[0] || null,
      collaborators,
    });
  } catch (err) {
    console.error("getCollaborators error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// 5. UPDATE ROLE
// MODULE 3 UPDATED:
// - allowed roles: admin, editor, viewer
// - owner and admin can update roles
// - user cannot change own role
// ─────────────────────────────────────────────
exports.updateRole = async (req, res) => {
  try {
    const { collab_id, role } = req.body;
    const allowedRoles = ["admin", "editor", "viewer"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const [collab] = await db.execute(
      `SELECT id, design_id, user_id, role
       FROM editor_collaborators
       WHERE id = ?`,
      [collab_id]
    );

    if (!collab.length) {
      return res.status(404).json({
        message: "Collaborator not found",
      });
    }

    const currentUserRole = await getDesignRole(
      collab[0].design_id,
      req.user.id
    );

    if (currentUserRole !== "owner" && currentUserRole !== "admin") {
      return res.status(403).json({
        message: "Only owner or admin can update role",
      });
    }

    if (Number(collab[0].user_id) === Number(req.user.id)) {
      return res.status(403).json({
        message: "You cannot change your own role",
      });
    }

    await db.execute(
      `UPDATE editor_collaborators
       SET role = ?
       WHERE id = ?`,
      [role, collab_id]
    );

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("updateRole error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// 6. REMOVE COLLABORATOR
// MODULE 3 UPDATED:
// - only owner can remove collaborators
// - admin can change role but cannot remove
// ─────────────────────────────────────────────
exports.removeCollaborator = async (req, res) => {
  try {
    const { collab_id } = req.params;

    const [collab] = await db.execute(
      `SELECT id, design_id, user_id
       FROM editor_collaborators
       WHERE id = ?`,
      [collab_id]
    );

    if (!collab.length) {
      return res.status(404).json({
        message: "Collaborator not found",
      });
    }

    const currentUserRole = await getDesignRole(
      collab[0].design_id,
      req.user.id
    );

    if (currentUserRole !== "owner") {
      return res.status(403).json({
        message: "Only owner can remove collaborators",
      });
    }

    await db.execute(
      `DELETE FROM editor_collaborators
       WHERE id = ?`,
      [collab_id]
    );

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("removeCollaborator error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// 7. SHARED WITH ME
// ROUTE:
// GET /api/collaboration/shared-with-me
//
// Used by Projects.jsx to show accepted shared projects.
// ─────────────────────────────────────────────
exports.getSharedWithMe = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await db.execute(
      `SELECT
        d.id AS design_id,
        d.name,
        d.width,
        d.height,
        d.updated_at,
        u.name AS owner_name,
        ec.role
      FROM editor_collaborators ec
      JOIN designs d ON ec.design_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE ec.user_id = ?
      AND ec.status = 'accepted'
      AND d.is_deleted = 0`,
      [user_id]
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("getSharedWithMe error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────
// 8. RESEND INVITE
// ─────────────────────────────────────────────
exports.resendInvite = async (req, res) => {
  try {
    const { collab_id } = req.body;

    const [collab] = await db.execute(
      `SELECT design_id
       FROM editor_collaborators
       WHERE id = ?`,
      [collab_id]
    );

    if (!collab.length) {
      return res.status(404).json({
        message: "Collaborator not found",
      });
    }

    const ownerCheck = await getDesignRole(collab[0].design_id, req.user.id);

    if (ownerCheck !== "owner") {
      return res.status(403).json({
        message: "Only owner can resend invite",
      });
    }

    const new_token = crypto.randomBytes(32).toString("hex");
    const token_expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.execute(
      `UPDATE editor_collaborators
       SET invite_token = ?,
           token_expiry = ?
       WHERE id = ?`,
      [new_token, token_expiry, collab_id]
    );

    const inviteLink = `http://localhost:5173/invite/accept?token=${new_token}`;

    return res.json({
      success: true,
      inviteLink,
    });
  } catch (err) {
    console.error("resendInvite error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};