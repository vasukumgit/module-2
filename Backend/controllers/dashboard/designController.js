const db = require("../../config/db");
 
// ===============================
// CREATE DESIGN
// ===============================

exports.createDesign = async (req, res, next) => {
  try {

    const {
      name,
      template_id,
      width,
      height,
      folder_id,
      type,
      design_data
    } = req.body;

    const user_id = req.user.id;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    if (!template_id && (!width || !height)) {
      return res.status(400).json({
        success: false,
        message: "Either template_id OR width and height are required"
      });
    }

    // ==========================================
    // CREATE PROJECT
    // ==========================================

    const [projectResult] = await db.execute(
      `
      INSERT INTO projects
      (
        user_id,
        title,
        width,
        height,
        type
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        user_id,
        name,
        width || null,
        height || null,
        type || "custom"
      ]
    );

    const project_id = projectResult.insertId;

    // ==========================================
    // CREATE DESIGN
    // ==========================================

    const [result] = await db.execute(
      `
      INSERT INTO designs
      (
        user_id,
        project_id,
        name,
        template_id,
        width,
        height,
        folder_id,
        type,
        design_data
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        project_id,
        name,
        template_id || null,
        width || null,
        height || null,
        folder_id || null,
        type || "custom",
        design_data
          ? JSON.stringify(design_data)
          : null
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Design created successfully",
      designId: result.insertId,
      projectId
    });

  } catch (error) {

    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Design name already exists"
      });
    }

    return next(error);
  }
};
// exports.createDesign = async (req, res ,next) => {
//   try {
//     const { name, template_id, width, height,folder_id,type, design_data  } = req.body;
//     const user_id = req.user.id;
 
//     if (!name) {
//   const error = new Error("Project name is required");
//   error.statusCode = 400;
//   throw error;
// }
 
//     if (!template_id && (!width || !height)) {
//       return res.status(400).json({
//           success: false,
//         message: "Either template_id OR width and height are required",
//       });
//     }
//    const [projectResult] = await db.execute(
//   `INSERT INTO projects
//    (user_id, title, width, height, type)
//    VALUES (?, ?, ?, ?, ?)`,
//   [
//     user_id,
//     name,
//     width || null,
//     height || null,
//     type || "custom"
//   ]
// );

// const project_id = projectResult.insertId;
// //     const sql = `
// //       INSERT INTO designs (user_id, name, template_id, width, height,folder_id,type, design_data)
// //       VALUES (?, ?, ?, ?, ?,?,?,?)
// //     `;
//  const sql = `
//   INSERT INTO designs
//   (
//     user_id,
//     project_id,
//     name,
//     template_id,
//     width,
//     height,
//     folder_id,
//     type,
//     design_data
//   )
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
// `;
// //     const [result] = await db.execute(sql, [
// //       user_id,
// //       name,
// //       template_id || null,
// //       width || null,
// //       height || null,
// //       folder_id || null,
// //         type || 'custom',
// // design_data ? JSON.stringify(design_data) : null
// //     ]);
// const [result] = await db.execute(sql, [
//   user_id,
//   project_id,
//   name,
//   template_id || null,
//   width || null,
//   height || null,
//   folder_id || null,
//   type || 'custom',
//   design_data ? JSON.stringify(design_data) : null
// ]);
 
//     return res.status(201).json({
//       success: true,
//       message: "Project created successfully",
//       projectId: result.insertId,
//     });
 
//   } catch (error) {
//     console.error(error);
//     // DB duplicate name error handle
//     if (error.code === "ER_DUP_ENTRY") {
//       return res.status(409).json({
//         success: false,
//         message: "Design name already exists",
//       });
//     }
//     return next(error); // existing errorHandler
//   }
// };
 
 
// ===============================
// GET ALL DESIGNS (Logged User)
// ===============================
exports.getDesigns = async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search ? `%${req.query.search}%` : '%';
 
    const offset = (page - 1) * limit;
 
//     const sql = `
//   SELECT * FROM designs
//   WHERE user_id = ?
//   AND is_deleted = 0
//   AND (name LIKE ? OR type LIKE ?)
//   ORDER BY created_at DESC
//    LIMIT ${limit} OFFSET ${offset}
// `;

const sql = `
SELECT d.*, f.name AS folder_name
FROM designs d
LEFT JOIN folders f ON d.folder_id = f.id
WHERE d.user_id = ?
AND d.is_deleted = 0
AND (d.name LIKE ? OR d.type LIKE ?)
ORDER BY d.created_at DESC
LIMIT ${limit} OFFSET ${offset}
`;
 
    const [rows] = await db.execute(sql, [user_id,search,search]);
     
    const formattedRows = rows.map(row => ({
  ...row,
  design_data: row.design_data
    ? JSON.parse(row.design_data)
    : null
}));
    return res.status(200).json({
      success: true,
      message: "Designs fetched successfully",
       page,
      limit,
      data: formattedRows
    });
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error" });
  }
};
 
 
// ===============================
// GET SINGLE DESIGN
// ===============================
exports.getSingleDesign = async (req, res) => {
  try {

    const { id } = req.params;

    const user_id = req.user.id;

    // MODULE 3 UPDATED:
    // owner OR accepted collaborator can access

    const sql = `
      SELECT DISTINCT
        d.*,
        f.name AS folder_name
      FROM designs d

      LEFT JOIN folders f
        ON d.folder_id = f.id

      LEFT JOIN editor_collaborators ec
        ON ec.design_id = d.id

      WHERE d.id = ?
      AND d.is_deleted = 0

      AND (
        d.user_id = ?
        OR (
          ec.user_id = ?
          AND ec.status = 'accepted'
        )
      )
    `;

    const [rows] = await db.execute(sql, [
      id,
      user_id,
      user_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    const design = rows[0];

    design.design_data = design.design_data
      ? JSON.parse(design.design_data)
      : null;

    return res.status(200).json({
      success: true,
      message: "Design fetched successfully",
      data: design,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
 
 
// ===============================
// UPDATE DESIGN
// ===============================
exports.updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const {
      name,
      width,
      height,
      template_id,
      design_data,
      type
    } = req.body;

    // OWNER OR ACCEPTED COLLABORATOR
    const [accessRows] = await db.execute(
      `
      SELECT
        d.id,
        d.user_id AS owner_id,
        ec.role AS collaborator_role
      FROM designs d
      LEFT JOIN editor_collaborators ec
        ON ec.design_id = d.id
        AND ec.user_id = ?
        AND ec.status = 'accepted'
      WHERE d.id = ?
      AND d.is_deleted = 0
      LIMIT 1
      `,
      [user_id, id]
    );

    if (accessRows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "not_saved",
        message: "Design not found"
      });
    }

    const design = accessRows[0];

    const isOwner =
      Number(design.owner_id) === Number(user_id);

    const canEdit =
      isOwner ||
      design.collaborator_role === "admin" ||
      design.collaborator_role === "editor";

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        status: "not_saved",
        message: "Viewer does not have edit permission"
      });
    }

    const [result] = await db.execute(
      `
      UPDATE designs
      SET
        name = ?,
        width = ?,
        height = ?,
        template_id = ?,
        type = ?,
        design_data = ?,
        updated_at = NOW()
      WHERE id = ?
      AND is_deleted = 0
      `,
      [
        name,
        width || null,
        height || null,
        template_id || null,
        type || "custom",
        design_data
          ? JSON.stringify(design_data)
          : null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        status: "not_saved",
        message: "Update failed"
      });
    }

    const io = req.app.get("io");

    io.to(`design-${id}`).emit("design-saved", {
      design_id: id,
      user_id,
      updated_at: new Date(),
      saving: false
    });

    return res.status(200).json({
      success: true,
      status: "saved",
      message: "Design updated successfully"
    });

  } catch (error) {
    console.error("updateDesign error:", error);

    return res.status(500).json({
      success: false,
      status: "not_saved",
      message: "Server error"
    });
  }
};
// ===============================
// DELETE DESIGN (Soft Delete)
// ===============================
exports.deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
 
    const sql = `
      UPDATE designs
      SET is_deleted = 1, updated_at = NOW()
      WHERE id = ?
      AND user_id = ?
      AND is_deleted = 0
    `;
 
    const [result] = await db.execute(sql, [id, user_id]);
 
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Design not found" });
    }
 
    return res.status(200).json({
      success: true,
      message: "Design moved to trash successfully"
    });
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.restoreDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
 
    const sql = `
      UPDATE designs
      SET is_deleted = 0,
          updated_at = NOW()
      WHERE id = ?
      AND user_id = ?
      AND is_deleted = 1
    `;
 
    const [result] = await db.execute(sql, [id, user_id]);
 
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Design not found in trash" });
    }
 
    return res.status(200).json({
      success: true,
      message: "Design restored successfully"
    });
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
 
// create folder
exports.createFolder = async (req, res) => {
  try {

    const { name } = req.body;

    const user_id = req.user.id;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required"
      });
    }

    // ==========================================
    // CHECK DUPLICATE
    // ==========================================

    const [existing] = await db.execute(
      `
      SELECT id
      FROM folders
      WHERE user_id = ?
      AND name = ?
      `,
      [user_id, name]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Folder already exists"
      });
    }

    // ==========================================
    // CREATE FOLDER
    // ==========================================

    const [result] = await db.execute(
      `
      INSERT INTO folders
      (
        user_id,
        name
      )
      VALUES (?, ?)
      `,
      [user_id, name]
    );

    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      folderId: result.insertId
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

// ======================================================
// GET FOLDERS
// ======================================================

exports.getFolders = async (req, res) => {
  try {

    const user_id = req.user.id;

    const sql = `
      SELECT *
      FROM folders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.execute(sql, [
      user_id
    ]);

    return res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};