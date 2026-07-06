const db = require("../../../../config/db");

/*
=========================================
GET ALL
=========================================
*/
exports.getAllTemplates = async (req, res) => {
  try {

    const [templates] = await db.query(`
      SELECT *
      FROM editor_templates
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      templates
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};


/*
=========================================
GET RECENT
=========================================
*/
exports.getRecentTemplates = async (req, res) => {
  try {

    const [templates] = await db.query(`
      SELECT *
      FROM editor_templates
      WHERE is_recent = TRUE
      ORDER BY last_used DESC
      LIMIT 10
    `);

    res.status(200).json({
      success: true,
      templates
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};


/*
=========================================
STAR / UNSTAR
=========================================
*/
exports.toggleStarTemplate = async (req, res) => {

  try {

    const { user_id, template_id } =
      req.params;

    // ✅ FIXED: use starred_items table with item_type = 'template'
    const [existing] = await db.query(
      `
      SELECT *
      FROM editor_starred_items
      WHERE user_id=?
      AND item_id=?
      AND item_type='template'
      `,
      [user_id, template_id]
    );

    if (existing.length > 0) {

      await db.query(
        `
        DELETE FROM editor_starred_items
        WHERE user_id=?
        AND item_id=?
        AND item_type='template'
        `,
        [user_id, template_id]
      );

      return res.json({
        success: true,
        starred: false
      });
    }

    await db.query(
      `
      INSERT INTO starred_items
      (
        user_id,
        item_id,
        item_type,
        is_starred
      )
      VALUES (?,?,'template',TRUE)
      `,
      [user_id, template_id]
    );

    res.json({
      success: true,
      starred: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};


/*
=========================================
GET STARRED
=========================================
*/
exports.getStarredTemplates =
async (req, res) => {

  try {

    const { user_id } = req.params;

    // ✅ FIXED: join starred_items with item_type = 'template'
    const [templates] =
      await db.query(
        `
        SELECT et.*
        FROM editor_starred_items si
        JOIN editor_templates et
        ON si.item_id = et.id
        WHERE si.user_id = ?
        AND si.item_type = 'template'
        AND si.is_starred = TRUE
        `,
        [user_id]
      );

    res.json({
      success: true,
      templates
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};


/*
=========================================
SEARCH
=========================================
*/
exports.searchTemplates =
async (req, res) => {

  try {

    const { query } = req.query;

    const value = `%${query}%`;

    const [templates] =
      await db.query(
        `
        SELECT *
        FROM editor_templates
        WHERE template_name LIKE ?
        OR color LIKE ?
        OR license LIKE ?
        OR orientation LIKE ?
        `,
        [
          value,
          value,
          value,
          value
        ]
      );

    res.json({
      success: true,
      templates
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};


/*
=========================================
FILTER
=========================================
*/
exports.filterTemplates =
async (req, res) => {

  try {

    const {
      license,
      orientation,
      color
    } = req.query;

    let query =
      `SELECT * FROM editor_templates WHERE 1=1`;

    const values = [];

    if (license) {
      query += ` AND license=?`;
      values.push(license);
    }

    if (orientation) {
      query += ` AND orientation=?`;
      values.push(orientation);
    }

    if (color) {
      query += ` AND color=?`;
      values.push(color);
    }

    const [templates] =
      await db.query(
        query,
        values
      );

    res.json({
      success: true,
      templates
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};


/*
=========================================
LAST USED
=========================================
*/
exports.updateLastUsed =
async (req, res) => {

  try {

    const { template_id } =
      req.params;

    await db.query(
      `
      UPDATE editor_templates
      SET
      is_recent=TRUE,
      last_used=NOW()
      WHERE id=?
      `,
      [template_id]
    );

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};


/*
=========================================
VIEW MORE DETAILS
=========================================
*/
exports.getTemplateDetails =
async (req, res) => {

  try {

    const { template_id } =
      req.params;

    const [rows] =
      await db.query(
        `
        SELECT
        id,
        template_name,
        about,
        tag1,
        tag2,
        tag3,
        tag4,
        tag5
        FROM editor_templates
        WHERE id=?
        `,
        [template_id]
      );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false
      });
    }

    const template = rows[0];

    res.json({
      success: true,
      template: {
        id: template.id,
        template_name:
          template.template_name,
        about: template.about,
        tags: [
          template.tag1,
          template.tag2,
          template.tag3,
          template.tag4,
          template.tag5
        ].filter(Boolean)
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};