const db = require("../../config/db");

exports.searchProjects = async (req, res) => {
  try {
    let { q, page } = req.query;

    page = parseInt(page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const search = q ? `%${q}%` : "%";

    const sql = `
      (
        SELECT
          id,
          title,
          description,
          category,
          type,
          created_at,
          'project' AS source
        FROM projects
        WHERE
          title LIKE ?
          OR description LIKE ?
          OR category LIKE ?
          OR type LIKE ?
      )

      UNION ALL

      (
        SELECT
          id,
          title,
          NULL AS description,
          category,
          type,
          created_at,
          'template' AS source
        FROM templates
        WHERE
          title LIKE ?
          OR category LIKE ?
          OR type LIKE ?
          OR industry LIKE ?
      )

      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(sql, [
      search,
      search,
      search,
      search,

      search,
      search,
      search,
      search,

      limit,
      offset
    ]);

    const countSql = `
      SELECT (
        (SELECT COUNT(*)
         FROM projects
         WHERE
           title LIKE ?
           OR description LIKE ?
           OR category LIKE ?
           OR type LIKE ?)

        +

        (SELECT COUNT(*)
         FROM templates
         WHERE
           title LIKE ?
           OR category LIKE ?
           OR type LIKE ?
           OR industry LIKE ?)
      ) AS total
    `;

    const [countResult] = await db.query(countSql, [
      search,
      search,
      search,
      search,

      search,
      search,
      search,
      search
    ]);

    const total = countResult[0].total;

    res.json({
      success: true,
      message: total > 0 ? "Data found" : "No data found",
      page,
      totalResults: total,
      totalPages: Math.ceil(total / limit),
      results: rows
    });

  } catch (error) {
    console.error("search error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};