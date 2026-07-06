const db = require("../../config/db");
 
// Helper - get user role
const getUserRole = async (team_id, user_id) => {
  const [rows] = await db.execute(
    "SELECT role FROM team_members WHERE team_id = ? AND user_id = ?",
    [team_id, user_id]
  );
  return rows.length ? rows[0].role : null;
};
 
// ===============================
// CREATE TEAM
// ===============================
exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const owner_id = req.user.id;
 
    if (!name) {
      return res.status(400).json({ message: "Team name required" });
    }
 
    const [result] = await db.execute(
      "INSERT INTO teams (name, owner_id) VALUES (?, ?)",
      [name, owner_id]
    );
 
    await db.execute(
      "INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)",
      [result.insertId, owner_id, "owner"]
    );
 
    res.status(201).json({
      message: "Team created",
      team_id: result.insertId
    });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ===============================
// GET MY TEAMS (LIST)
// ===============================
exports.getMyTeams = async (req, res) => {
  try {
    const user_id = req.user.id;
 
    const [rows] = await db.execute(
      `SELECT
        t.id AS team_id,
        t.name AS team_name,
        u.name AS owner_name,
        tm.role,
        t.created_at
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.id
      JOIN users u ON t.owner_id = u.id
      WHERE tm.user_id = ?
      ORDER BY t.created_at DESC`,
      [user_id]
    );
   
     // FORMAT DATE HERE
const formattedRows = rows.map(team => {
  const d = new Date(team.created_at);
 
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
 
  return {
    ...team,
    created_at: `${day}-${month}-${year}`
  };
});
 
res.json(formattedRows);
 
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ===============================
// GET TEAM MEMBERS
// ===============================
exports.getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;
 
    // check user is part of team
    const myRole = await getUserRole(teamId, req.user.id);
    if (!myRole) {
      return res.status(403).json({ message: "Access denied" });
    }
 
    const [rows] = await db.execute(
      `SELECT
        tm.id,
        u.name,
        u.email,
        tm.role
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = ?`,
      [teamId]
    );
 
    res.json(rows);
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ===============================
// ADD MEMBER
// ===============================
exports.addMember = async (req, res) => {
  try {
    const { team_id, email, role } = req.body;
    const user_id = req.user.id;
 
    const myRole = await getUserRole(team_id, user_id);
    if (!["owner", "admin"].includes(myRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
 
    const [users] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
 
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
 
    const new_user_id = users[0].id;
 
    // check already exists
    const [existing] = await db.execute(
      "SELECT id FROM team_members WHERE team_id = ? AND user_id = ?",
      [team_id, new_user_id]
    );
 
    if (existing.length) {
      return res.status(400).json({ message: "User already in team" });
    }
 
    const validRoles = ["admin", "editor", "viewer"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
 
    await db.execute(
      "INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)",
      [team_id, new_user_id, role || "viewer"]
    );
 
    res.json({ message: "Member added" });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ===============================
// REMOVE MEMBER
// ===============================
exports.removeMember = async (req, res) => {
  try {
    const { id } = req.params;
 
    const [member] = await db.execute(
      "SELECT team_id, role FROM team_members WHERE id = ?",
      [id]
    );
 
    if (!member.length) {
      return res.status(404).json({ message: "Member not found" });
    }
 
    const team_id = member[0].team_id;
 
    const myRole = await getUserRole(team_id, req.user.id);
    if (!["owner", "admin"].includes(myRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
 
    // cannot remove owner
    if (member[0].role === "owner") {
      return res.status(400).json({ message: "Cannot remove owner" });
    }
 
    // admin cannot remove another admin
    if (myRole === "admin" && member[0].role === "admin") {
      return res.status(403).json({ message: "Admin cannot remove another admin" });
    }
 
    await db.execute(
      "DELETE FROM team_members WHERE id = ?",
      [id]
    );
 
    res.json({ message: "Member removed" });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ===============================
// UPDATE ROLE
// ===============================
exports.updateRole = async (req, res) => {
  try {
    const { member_id, role } = req.body;
 
    const validRoles = ["admin", "editor", "viewer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
 
    const [member] = await db.execute(
      "SELECT team_id, role FROM team_members WHERE id = ?",
      [member_id]
    );
 
    if (!member.length) {
      return res.status(404).json({ message: "Member not found" });
    }
 
    const team_id = member[0].team_id;
 
    const myRole = await getUserRole(team_id, req.user.id);
    if (!["owner", "admin"].includes(myRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
 
    // protect owner
    if (member[0].role === "owner") {
      return res.status(400).json({ message: "Cannot change owner role" });
    }
 
    // admin cannot change admin/owner
    if (myRole === "admin" && member[0].role !== "viewer" && member[0].role !== "editor") {
      return res.status(403).json({ message: "Admin cannot change this role" });
    }
 
    await db.execute(
      "UPDATE team_members SET role = ? WHERE id = ?",
      [role, member_id]
    );
 
    res.json({ message: "Role updated" });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 