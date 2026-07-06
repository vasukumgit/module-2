const db = require("../../config/db");
 
 
// ===============================
// GET TRASH (User Based)
// ===============================
exports.getTrash = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;
 
    let sql = "SELECT * FROM trash WHERE userId = ?";
    let values = [userId];
 
    if (type) {
      sql += " AND type = ?";
      values.push(type);
    }
 
    const [rows] = await db.query(sql, values);
 
    res.status(200).json(rows);
 
  } catch (err) {
    console.error("Get Trash Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
 
 
// ===============================
// ADD TO TRASH
// ===============================
exports.addToTrash = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, type, originalId } = req.body;
 
    if (!title || !type) {
      return res.status(400).json({ message: "All fields required" });
    }
 
    await db.query(
      "INSERT INTO trash (originalId, title, type, userId) VALUES (?, ?, ?, ?)",
      [originalId || null, title, type, userId]
    );
 
    res.status(201).json({ message: "Moved to Trash" });
 
  } catch (err) {
    console.error("Add Trash Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
 
 
// ===============================
// RECOVER ITEM
// ===============================
exports.recoverTrash = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
 
    // 1. Get item from trash
    const [rows] = await db.query(
      "SELECT * FROM trash WHERE id = ? AND userId = ?",
      [id, userId]
    );
 
    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found in trash" });
    }
 
    const item = rows[0];
 
    // 2. Restore to projects
    await db.query(
      "INSERT INTO projects (user_id, title) VALUES (?, ?)",
      [userId, item.title]
    );
 
    // 3. Remove from trash
    await db.query(
      "DELETE FROM trash WHERE id = ? AND userId = ?",
      [id, userId]
    );
 
    res.json({ message: "Project restored successfully" });
 
  } catch (err) {
    console.error("Recover Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
 
 
// ===============================
// DELETE PERMANENTLY
// ===============================
exports.deleteTrash = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
 
    await db.query(
      "DELETE FROM trash WHERE id = ? AND userId = ?",
      [id, userId]
    );
 
    res.json({ message: "Deleted Permanently" });
 
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
 
 
// ===============================
// EMPTY TRASH
// ===============================
exports.emptyTrash = async (req, res) => {
  try {
    const userId = req.user.id;
 
    await db.query(
      "DELETE FROM trash WHERE userId = ?",
      [userId]
    );
 
    res.json({ message: "Trash Emptied Successfully" });
 
  } catch (err) {
    console.error("Empty Trash Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
 