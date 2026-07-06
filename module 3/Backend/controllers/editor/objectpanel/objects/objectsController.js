const db = require("../../../../config/db");

const getObjects = async (req, res) => {
  try {
    const { category, type, sub_category, search } = req.query;

    let query = "SELECT * FROM objects WHERE 1=1";
    let values = [];

    if (category) {
      query += " AND category = ?";
      values.push(category);
    }

    if (type) {
      query += " AND type = ?";
      values.push(type);
    }

    if (sub_category) {
      query += " AND sub_category = ?";
      values.push(sub_category);
    }

    if (search) {
      query += " AND name LIKE ?";
      values.push(`%${search}%`);
    }

    const [rows] = await db.query(query, values);

    res.json(rows);

  } catch (err) {
    res.status(500).json({ message: "Error fetching objects" });
  }
};

module.exports = { getObjects };