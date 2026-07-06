const db = require("../../config/db");
 
// SET tool
exports.setTool = async (req, res) => {
  try {
    const { userId, canvasId, tool, subTool } = req.body;
 
    const query = `
      INSERT INTO editor_tool_state (user_id, canvas_id, tool, sub_tool)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        tool = VALUES(tool),
        sub_tool = VALUES(sub_tool)
    `;
 
    await db.execute(query, [userId, canvasId, tool, subTool]);
 
    return res.status(200).json({
      success: true,
      message: "Tool updated successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error updating tool"
    });
  }
};
 
// GET tool
exports.getTool = async (req, res) => {
  try {
    const { userId, canvasId } = req.query;
 
    const query = `
      SELECT tool, sub_tool
      FROM editor_tool_state
      WHERE user_id = ? AND canvas_id = ?
      LIMIT 1
    `;
 
    const [rows] = await db.execute(query, [userId, canvasId]);
 
    return res.status(200).json({
      success: true,
      data: rows[0] || null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error fetching tool"
    });
  }
};
 
exports.getAllTools = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, tool, sub_tool FROM editor_tools ORDER BY tool"
    );
 
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching tools:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tools",
    });
  }
};