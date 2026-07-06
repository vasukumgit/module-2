const db = require("../../../../config/db");

// ADD RECENT
exports.addRecent = async (req, res) => {
  try {
    const { user_id, object_id } = req.body;

    await db.query(
      "DELETE FROM recent_objects WHERE user_id=? AND object_id=?",
      [user_id, object_id]
    );

    await db.query(
      "INSERT INTO recent_objects (user_id, object_id) VALUES (?, ?)",
      [user_id, object_id]
    );

    res.json({ message: "Added to recent" });

  } catch (err) {
    res.status(500).json({ message: "Error adding recent" });
  }
};

// GET RECENT
exports.getRecent = async (req, res) => {
  try {
    const { user_id, category } = req.query;

    const [data] = await db.query(
      `SELECT o.*
       FROM recent_objects r
       JOIN objects o ON r.object_id = o.id
       WHERE r.user_id = ?
       AND o.category = ?
       ORDER BY r.created_at DESC
       LIMIT 20`,
      [user_id, category]
    );

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Error fetching recent" });
  }
};