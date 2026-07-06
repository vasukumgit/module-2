const db = require("../../../../config/db");

// ==========================================
// GET GRAPHICS
// ==========================================

const getGraphics = async (req, res) => {
  try {

    const {
      search = "",
      type = "",
      sub_category = "",
      page = 1,
      limit = 100
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // ==========================================
    // BASE QUERY
    // ==========================================

    let query = `
      SELECT
        id,
        name,
        type,
        category,
        sub_category,
        asset_url,
        created_at
      FROM objects
      WHERE category = 'graphics'
    `;

    let values = [];

    // ==========================================
    // TYPE FILTER
    // ==========================================

    if (type) {
      query += ` AND type = ?`;
      values.push(type);
    }

    // ==========================================
    // SUB CATEGORY FILTER
    // ==========================================

    if (sub_category) {
      query += ` AND sub_category = ?`;
      values.push(sub_category);
    }

    // ==========================================
    // SEARCH FILTER
    // ==========================================

    if (search) {
      query += ` AND LOWER(name) LIKE LOWER(?)`;
      values.push(`%${search}%`);
    }

    // ==========================================
    // ORDER + PAGINATION
    // ==========================================

    query += `
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    values.push(limitNum, offset);

    // ==========================================
    // EXECUTE QUERY
    // ==========================================

    const [rows] = await db.query(query, values);

    // ==========================================
    // COUNT QUERY
    // ==========================================

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM objects
      WHERE category = 'graphics'
    `;

    let countValues = [];

    if (type) {
      countQuery += ` AND type = ?`;
      countValues.push(type);
    }

    if (sub_category) {
      countQuery += ` AND sub_category = ?`;
      countValues.push(sub_category);
    }

    if (search) {
      countQuery += ` AND LOWER(name) LIKE LOWER(?)`;
      countValues.push(`%${search}%`);
    }

    const [countRows] = await db.query(
      countQuery,
      countValues
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      page: pageNum,
      limit: limitNum,
      total: countRows[0].total,
      count: rows.length,
      data: rows
    });

  } catch (error) {

    console.error("GRAPHICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching graphics",
      error: error.message
    });

  }
};

module.exports = {
  getGraphics
};