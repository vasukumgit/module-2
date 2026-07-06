const db = require("../../config/db");

// ======================================================
// SAFE JSON PARSE
// ======================================================
const parseJSON = (data) => {
  try {
    return typeof data === "string"
      ? JSON.parse(data)
      : data;
  } catch {
    return {};
  }
};

// ======================================================
// CREATE DESIGN
// ======================================================
const createDesign = async (req, res) => {

  let conn;

  try {

    const user_id = req.user?.id;

    const {
      name = "Untitled",
      width = 800,
      height = 600,
      type = "custom",
      folder_id = null,
      template_id = null,
      title = "Untitled",
      design_data = [],
    } = req.body;

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    conn = await db.getConnection();

    await conn.beginTransaction();

    // ======================================================
    // UNIQUE NAME
    // ======================================================

    let finalName = title || name;

    const [existingRows] = await conn.execute(
      `SELECT COUNT(*) AS total
       FROM designs
       WHERE user_id = ?
       AND name = ?
       AND is_deleted = 0`,
      [user_id, finalName]
    );

    if (existingRows[0].total > 0) {
      finalName = `${finalName}-${Date.now()}`;
    }

    // ======================================================
    // GET FOLDER NAME
    // ======================================================

    let finalFolderName = null;

    if (folder_id) {

      const [folderRows] = await conn.execute(
        `SELECT name
         FROM folders
         WHERE id = ?
         LIMIT 1`,
        [folder_id]
      );

      if (folderRows.length > 0) {
        finalFolderName = folderRows[0].name;
      }
    }

    // ======================================================
    // CREATE PROJECT
    // ======================================================

    const [projectResult] = await conn.execute(
      `INSERT INTO projects
      (
        user_id,
        title,
        description,
        width,
        height,
        type,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        user_id,
        finalName,
        "Auto Created Project",
        width,
        height,
        type,
      ]
    );

    const project_id = projectResult.insertId;

    // ======================================================
    // CREATE DESIGN
    // ======================================================

    const [designResult] = await conn.execute(
      `INSERT INTO designs
      (
        user_id,
        project_id,
        name,
        template_id,
        width,
        height,
        design_data,
        is_deleted,
        folder_id,
        type,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())`,
      [
        user_id,
        project_id,
        finalName,
        template_id,
        width,
        height,
        JSON.stringify(design_data),
        folder_id,
        type,
      ]
    );

    const design_id = designResult.insertId;

    // ======================================================
    // CREATE DESIGN FILE
    // ======================================================

    const [fileResult] = await conn.execute(
      `INSERT INTO design_files
      (
        user_id,
        design_id,
        project_id,
        title,
        folder_name,
        folder_id,
        cloud_status,
        design_data,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        user_id,
        design_id,
        project_id,
        finalName,
        finalFolderName,
        folder_id,
        "saved",
        JSON.stringify(design_data),
      ]
    );

    await conn.commit();

    return res.status(201).json({
      success: true,
      message: "Design created successfully",
      data: {
        project_id,
        design_id,
        file_id: fileResult.insertId,
      },
    });

  } catch (err) {

    if (conn) {
      await conn.rollback();
    }

    console.error("createDesign error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create design",
      error: err.message,
    });

  } finally {

    if (conn) {
      conn.release();
    }
  }
};

// ======================================================
// AUTO SAVE DESIGN
// ======================================================
const autoSaveDesign = async (req, res) => {

  try {

    const { design_id } = req.params;

    if (!design_id) {
      return res.status(400).json({
        success: false,
        message: "Design ID required",
      });
    }

    const {
      title = null,
      design_data = [],
      cloud_status = "saved",
    } = req.body;

 
    // ======================================================
    // CHECK DESIGN
    // ======================================================

    const [designRows] = await db.execute(
      `SELECT *
       FROM designs
       WHERE id = ?
       LIMIT 1`,
      [design_id]
    );

    if (!designRows.length) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    const design = designRows[0];

    // ======================================================
    // UPDATE PROJECT
    // ======================================================

    if (title) {

      await db.execute(
        `UPDATE projects
         SET
           title = ?,
           updated_at = NOW()
         WHERE id = ?`,
        [title, design.project_id]
      );
    }

    // ======================================================
    // UPDATE DESIGN
    // ======================================================

    await db.execute(
      `UPDATE designs
       SET
         name = COALESCE(?, name),
         design_data = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        JSON.stringify(design_data),
        design_id,
      ]
    );

    // ======================================================
    // CHECK FILE
    // ======================================================

    const [fileRows] = await db.execute(
      `SELECT *
       FROM design_files
       WHERE design_id = ?
       LIMIT 1`,
      [design_id]
    );

    // ======================================================
    // UPDATE FILE
    // ======================================================

    if (fileRows.length > 0) {

      await db.execute(
        `UPDATE design_files
         SET
           title = COALESCE(?, title),
           design_data = ?,
           cloud_status = ?,
           updated_at = NOW()
         WHERE design_id = ?`,
        [
          title,
          JSON.stringify(design_data),
          cloud_status,
          design_id,
        ]
      );

    } else {

      // ======================================================
      // GET FOLDER NAME
      // ======================================================

      let finalFolderName = null;

      if (design.folder_id) {

        const [folderRows] = await db.execute(
          `SELECT name
           FROM folders
           WHERE id = ?
           LIMIT 1`,
          [design.folder_id]
        );

        if (folderRows.length > 0) {
          finalFolderName = folderRows[0].name;
        }
      }

      // ======================================================
      // INSERT FILE
      // ======================================================

      await db.execute(
        `INSERT INTO design_files
        (
          user_id,
          design_id,
          project_id,
          title,
          folder_name,
          folder_id,
          cloud_status,
          design_data,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          design.user_id,
          design_id,
          design.project_id,
          title || design.name,
          finalFolderName,
          design.folder_id || null,
          cloud_status,
          JSON.stringify(design_data),
        ]
      );
    }

    return res.status(200).json({
  success: true,
  message: "Design auto-saved successfully",
  cloud_status: "saved",
});

  } catch (err) {

    console.error("autoSaveDesign error:", err);

    return res.status(500).json({
      success: false,
      message: "Auto save failed",
      error: err.message,
    });
  }
};


// ======================================================
// GET SINGLE DESIGN
// ======================================================
const getDesign = async (req, res) => {

  try {

    const { design_id } = req.params;

    if (!design_id) {
      return res.status(400).json({
        success: false,
        message: "Design ID required",
      });
    }

    const [rows] = await db.execute(
      `SELECT

        d.id AS design_id,
        d.name,
        d.template_id,
        d.width,
        d.height,
        d.type,
        d.folder_id,
        d.design_data,
        d.created_at,
        d.updated_at,

        p.id AS project_id,
        p.title AS project_title,
        p.description,
        p.thumbnail,
        p.width AS project_width,
        p.height AS project_height,

        df.id AS file_id,
        df.title,
        df.folder_name,
        df.folder_id AS file_folder_id,
        df.cloud_status,
        df.design_data AS file_design_data

      FROM designs d

      LEFT JOIN projects p
      ON p.id = d.project_id

      LEFT JOIN design_files df
      ON df.design_id = d.id

      WHERE d.id = ?
      AND d.is_deleted = 0

      LIMIT 1`,
      [design_id]
    );

    if (!rows.length) {

      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    const data = rows[0];

    data.design_data = parseJSON(data.design_data);
    data.file_design_data = parseJSON(data.file_design_data);

    return res.status(200).json({
      success: true,
      design: data,
    });

  } catch (err) {

    console.error("getDesign error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ======================================================
// GET USER DESIGNS
// ======================================================
const getUserDesigns = async (req, res) => {

  try {

    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    const [rows] = await db.execute(
      `SELECT

        d.id AS design_id,
        d.name,
        d.width,
        d.height,
        d.type,
        d.folder_id,
        d.design_data,
        d.updated_at,

        p.id AS project_id,
        p.title AS project_title,
        p.thumbnail,

        df.id AS file_id,
        df.folder_name,
        df.folder_id,
        df.cloud_status

      FROM designs d

      LEFT JOIN projects p
      ON p.id = d.project_id

      LEFT JOIN design_files df
      ON df.design_id = d.id

      WHERE d.user_id = ?
      AND d.is_deleted = 0

      ORDER BY d.updated_at DESC`,
      [user_id]
    );

    return res.status(200).json({
      success: true,
      designs: rows,
    });

  } catch (err) {

    console.error("getUserDesigns error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ======================================================
// UPDATE CLOUD STATUS
// ======================================================
const updateCloudStatus = async (req, res) => {

  try {

    const { design_id } = req.params;
    const { cloud_status } = req.body;

    await db.execute(
      `UPDATE design_files
       SET
         cloud_status = ?,
         updated_at = NOW()
       WHERE design_id = ?`,
      [cloud_status, design_id]
    );

    return res.status(200).json({
      success: true,
      message: "Cloud status updated successfully",
    });

  } catch (err) {

    console.error("updateCloudStatus error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ======================================================
// UPDATE TITLE
// ======================================================
const updateTitle = async (req, res) => {

  try {

    const { design_id } = req.params;
    const { title } = req.body;

    const [designRows] = await db.execute(
      `SELECT *
       FROM designs
       WHERE id = ?`,
      [design_id]
    );

    if (!designRows.length) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    const project_id = designRows[0].project_id;

    await db.execute(
      `UPDATE projects
       SET
         title = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [title, project_id]
    );

    await db.execute(
      `UPDATE designs
       SET
         name = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [title, design_id]
    );

    await db.execute(
      `UPDATE design_files
       SET
         title = ?,
         updated_at = NOW()
       WHERE design_id = ?`,
      [title, design_id]
    );

    return res.status(200).json({
      success: true,
      message: "Title updated successfully",
    });

  } catch (err) {

    console.error("updateTitle error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ======================================================
// UPDATE FOLDER NAME
// ======================================================
const updateFolderName = async (req, res) => {

  try {

    const { design_id } = req.params;
    const { folder_name, folder_id } = req.body;

    await db.execute(
      `UPDATE design_files
       SET
         folder_name = ?,
         folder_id = ?,
         updated_at = NOW()
       WHERE design_id = ?`,
      [folder_name, folder_id, design_id]
    );

    await db.execute(
      `UPDATE designs
       SET
         folder_id = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [folder_id, design_id]
    );

    return res.status(200).json({
      success: true,
      message: "Folder updated successfully",
    });

  } catch (err) {

    console.error("updateFolderName error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ======================================================
// DELETE DESIGN
// ======================================================
const deleteDesign = async (req, res) => {

  try {

    const { design_id } = req.params;

    await db.execute(
      `UPDATE designs
       SET
         is_deleted = 1,
         updated_at = NOW()
       WHERE id = ?`,
      [design_id]
    );

    return res.status(200).json({
      success: true,
      message: "Design deleted successfully",
    });

  } catch (err) {

    console.error("deleteDesign error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  createDesign,
  autoSaveDesign,
  getDesign,
  getUserDesigns,
  updateCloudStatus,
  updateTitle,
  updateFolderName,
  deleteDesign,
};