const db = require("../../../../config/db");
 
 
// Get All Text Styles
const getAllTextStyles = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM text_styles ORDER BY created_at DESC"
    );
 
    res.status(200).json({
      success: true,
      data: rows,
    });
 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 
 
// Create Text Style
const createTextStyle = async (req, res) => {
  try {
    const {
      title,
      font_family,
      font_size,
      font_weight,
      text_color,
      preview_text,
      rotation,
      letter_spacing,
      line_height,
      text_transform,
      font_style,
      secondary_font_family,
      secondary_font_size,
      secondary_font_weight,
      secondary_font_style,
      secondary_text_color,
      secondary_text_transform,
      secondary_preview_text,
    } = req.body;

    const sql = `
      INSERT INTO text_styles (
        title,
        font_family,
        font_size,
        font_weight,
        text_color,
        preview_text,
        rotation,
        letter_spacing,
        line_height,
        text_transform,
        font_style,
        secondary_font_family,
        secondary_font_size,
        secondary_font_weight,
        secondary_font_style,
        secondary_text_color,
        secondary_text_transform,
        secondary_preview_text
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      title,
      font_family,
      font_size,
      font_weight,
      text_color,
      preview_text,
      rotation,
      letter_spacing,
      line_height,
      text_transform,
      font_style,
      secondary_font_family,
      secondary_font_size,
      secondary_font_weight,
      secondary_font_style,
      secondary_text_color,
      secondary_text_transform,
      secondary_preview_text,
    ]);

    res.status(201).json({
      success: true,
      message: "Text style created successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 
 
// Update Text Style
const updateTextStyle = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      font_family,
      font_size,
      font_weight,
      text_color,
      preview_text,
      rotation,
      letter_spacing,
      line_height,
      text_transform,
      font_style,
      secondary_font_family,
      secondary_font_size,
      secondary_font_weight,
      secondary_font_style,
      secondary_text_color,
      secondary_text_transform,
      secondary_preview_text,
    } = req.body;

    const sql = `
      UPDATE text_styles
      SET
        title = ?,
        font_family = ?,
        font_size = ?,
        font_weight = ?,
        text_color = ?,
        preview_text = ?,
        rotation = ?,
        letter_spacing = ?,
        line_height = ?,
        text_transform = ?,
        font_style = ?,
        secondary_font_family = ?,
        secondary_font_size = ?,
        secondary_font_weight = ?,
        secondary_font_style = ?,
        secondary_text_color = ?,
        secondary_text_transform = ?,
        secondary_preview_text = ?
      WHERE id = ?
    `;

    await db.query(sql, [
      title,
      font_family,
      font_size,
      font_weight,
      text_color,
      preview_text,
      rotation,
      letter_spacing,
      line_height,
      text_transform,
      font_style,
      secondary_font_family,
      secondary_font_size,
      secondary_font_weight,
      secondary_font_style,
      secondary_text_color,
      secondary_text_transform,
      secondary_preview_text,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Text style updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 
 
// Delete Text Style
const deleteTextStyle = async (req, res) => {
  try {
 
    const { id } = req.params;
 
    await db.query(
      "DELETE FROM text_styles WHERE id = ?",
      [id]
    );
 
    res.status(200).json({
      success: true,
      message: "Text style deleted successfully",
    });
 
  } catch (error) {
 
    res.status(500).json({
      success: false,
      message: error.message,
    });
 
  }
};
 
 
module.exports = {
  getAllTextStyles,
  createTextStyle,
  updateTextStyle,
  deleteTextStyle,
};
 