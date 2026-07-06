const db = require("../../config/db");

exports.createExport = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      design_id,
      export_type,
      format,
      quality,
      scale,
      title,
      description,
      tags,
      allow_reusing,
      file_url,
      file_size,
    } = req.body;

    if (!export_type) {
      return res.status(400).json({ msg: "Export type is required" });
    }

    const finalFormat = format || "png";
    const finalQuality = quality || 80;
    const finalScale = scale || "1x";
    const status = export_type === "publish" ? "published" : "exported";

    const [result] = await db.execute(
      `
      INSERT INTO editor_exports
      (
        design_id,
        user_id,
        export_type,
        format,
        quality,
        scale,
        title,
        description,
        tags,
        allow_reusing,
        file_url,
        file_size,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        design_id || null,
        user_id,
        export_type,
        finalFormat,
        finalQuality,
        finalScale,
        title || null,
        description || null,
        tags ? JSON.stringify(tags) : null,
        allow_reusing ? 1 : 0,
        file_url || null,
        file_size || null,
        status,
      ]
    );

    return res.status(201).json({
      msg:
        export_type === "publish"
          ? "Design published successfully"
          : "Design exported successfully",
      export_id: result.insertId,
    });
  } catch (err) {
    console.error("createExport error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserExports = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT *
      FROM editor_exports
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [user_id]
    );

    return res.json(rows);
  } catch (err) {
    console.error("getUserExports error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};