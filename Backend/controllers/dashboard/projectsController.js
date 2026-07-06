const db = require("../../config/db");
 
// ===============================
// CREATE PROJECT
// ===============================
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
 
    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }
 
    const [result] = await db.execute(
      "INSERT INTO projects (user_id, title, description) VALUES (?, ?, ?)",
      [userId, title, description || null]
    );
 
    res.status(201).json({
      message: "Project created",
      projectId: result.insertId,
    });
 
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
 
// ===============================
// GET USER PROJECTS
// ===============================
exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
 
    const [projects] = await db.execute(`
  SELECT 
    p.*,
    d.id AS design_id
  FROM projects p
  LEFT JOIN designs d ON d.project_id = p.id
  WHERE p.user_id = ?
  AND p.deletedAt IS NULL
  ORDER BY p.created_at DESC
`, [userId]);
 
    res.json(projects);
 
  } catch (err) {
    console.error("Fetch projects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
 
// ===============================
// DELETE PROJECT
// ===============================
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
     
     // 1. Get project details
    const [rows] = await db.execute(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?",
      [projectId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
     const project = rows[0];

    // 2. Insert into trash
    await db.execute(
      "INSERT INTO trash (originalId, title, type, userId) VALUES (?, ?, ?, ?)",
      [project.id, project.title, "project", userId]
    );

    // 3. Soft delete project
    await db.execute(
      "UPDATE projects SET deletedAt = NOW() WHERE id = ? AND user_id = ?",
      [projectId, userId]
    );

    res.json({ message: "Project moved to trash" });

  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// const db = require("../../config/db");
 
// // ===============================
// // CREATE PROJECT
// // ===============================
// exports.createProject = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const userId = req.user.id;
 
//     if (!title) {
//       return res.status(400).json({ message: "Title required" });
//     }
 
//     const [result] = await db.execute(
//       "INSERT INTO projects (user_id, title, description) VALUES (?, ?, ?)",
//       [userId, title, description || null]
//     );
 
//     res.status(201).json({
//       message: "Project created",
//       projectId: result.insertId,
//     });
 
//   } catch (err) {
//     console.error("Create project error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
 
 
// // ===============================
// // GET USER PROJECTS
// // ===============================
// exports.getUserProjects = async (req, res) => {
//   try {
//     const userId = req.user.id;
 
//     const [projects] = await db.execute(`
//   SELECT 
//     p.*,
//     d.id AS design_id
//   FROM projects p
//   LEFT JOIN designs d ON d.project_id = p.id
//   WHERE p.user_id = ?
//   AND p.deletedAt IS NULL
//   ORDER BY p.created_at DESC
// `, [userId]);
 
//     res.json(projects);
 
//   } catch (err) {
//     console.error("Fetch projects error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
 
 
// // ===============================
// // DELETE PROJECT
// // ===============================
// exports.deleteProject = async (req, res) => {
//   try {
//     const projectId = req.params.id;
//     const userId = req.user.id;
     
//      // 1. Get project details
//     const [rows] = await db.execute(
//       "SELECT * FROM projects WHERE id = ? AND user_id = ?",
//       [projectId, userId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Project not found" });
//     }
//      const project = rows[0];

//     // 2. Insert into trash
//     await db.execute(
//       "INSERT INTO trash (originalId, title, type, userId) VALUES (?, ?, ?, ?)",
//       [project.id, project.title, "project", userId]
//     );

//     // 3. Soft delete project
//     await db.execute(
//       "UPDATE projects SET deletedAt = NOW() WHERE id = ? AND user_id = ?",
//       [projectId, userId]
//     );

//     res.json({ message: "Project moved to trash" });

//   } catch (err) {
//     console.error("Delete project error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };