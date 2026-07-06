const db = require("../../config/db");

// ===============================
// GET PROFILE
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        id,
        name,
        email,
        phone,
        role,
        profile_image
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, role, profile_image } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    await db.execute(
      `UPDATE users 
       SET 
         name = ?, 
         phone = ?, 
         role = ?, 
         profile_image = ?
       WHERE id = ?`,
      [
        name,
        phone || null,
        role || null,
        profile_image || null,
        userId
      ]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};