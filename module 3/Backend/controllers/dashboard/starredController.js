const db = require("../../config/db");

// ⭐ Add Star
exports.addStar = async (req, res) => {
  const user_id = req.user.id;
  const { design_id } = req.body;

  await db.execute(
    "INSERT INTO starred_designs (user_id, design_id) VALUES (?, ?)",
    [user_id, design_id]
  );

  res.json({ message: "Starred" });
};

// ❌ Remove Star
exports.removeStar = async (req, res) => {
  const user_id = req.user.id;
  const { design_id } = req.params;

  await db.execute(
    "DELETE FROM starred_designs WHERE user_id=? AND design_id=?",
    [user_id, design_id]
  );

  res.json({ message: "Unstarred" });
};

// 📄 Get Stars
exports.getStars = async (req, res) => {
  const user_id = req.user.id;

  const [rows] = await db.execute(
    `SELECT d.* FROM starred_designs s
     JOIN designs d ON s.design_id = d.id
     WHERE s.user_id=?`,
    [user_id]
  );

  res.json(rows);
};