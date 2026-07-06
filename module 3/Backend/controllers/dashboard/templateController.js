const db = require("../../config/db");
/*
=========================================
CREATE TEMPLATE
=========================================
*/
exports.createTemplate = async (req, res) => {
  try {
    const {
      title,
      category,
      type,
      industry,
      is_premium,
      license,
      orientation,
      color,
      img,
      width,
      height,
      design_id,
      design_data,
      about,
      tag1,
      tag2,
      tag3,
      tag4,
      tag5
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO templates
      (
        title,
        category,
        type,
        industry,
        is_premium,
        license,
        orientation,
        color,
        img,
        width,
        height,
        design_id,
        design_data,
        about,
        tag1,
        tag2,
        tag3,
        tag4,
        tag5
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        category,
        type,
        industry,
        is_premium || 0,
        license || "free",
        orientation || "portrait",
        color || "",
        img || null,
        width || 212,
        height || 242,
        design_id,
        design_data
          ? JSON.stringify(design_data)
          : null,
        about || null,
        tag1 || null,
        tag2 || null,
        tag3 || null,
        tag4 || null,
        tag5 || null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      id: result.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/*
=========================================
GET ALL TEMPLATES
=========================================
*/
exports.getTemplates = async (req, res) => {
  try {

    const [templates] = await db.query(`
      SELECT *
      FROM templates
      ORDER BY id DESC
    `);

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
GET TEMPLATE BY ID
=========================================
*/
exports.getTemplateById = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT *
      FROM templates
      WHERE id = ?
    `,[id]);

    if (!rows.length) {

      return res.status(404).json({
        success: false,
        message: "Template not found"
      });

    }

    res.json({
      success: true,
      template: rows[0]
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
exports.searchTemplates = async (req, res) => {
  try {

    const search = req.query.search || "";

    const [rows] = await db.query(
      `
      SELECT *
      FROM templates
      WHERE title LIKE ?
      ORDER BY id DESC
      `,
      [`%${search}%`]
    );

    res.json({
      success: true,
      data: rows
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
exports.filterTemplates = async (req, res) => {
  try {

    const {
      category,
      type,
      industry,
      license,
      orientation,
      color
    } = req.query;

    let query = `
      SELECT *
      FROM templates
      WHERE 1=1
    `;

    const values = [];

    if (category) {
      query += ` AND category=?`;
      values.push(category);
    }

    if (type) {
      query += ` AND type=?`;
      values.push(type);
    }

    if (industry) {
      query += ` AND industry=?`;
      values.push(industry);
    }

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

    query += ` ORDER BY id DESC`;

    const [rows] = await db.query(
      query,
      values
    );

    res.json({
      success: true,
      data: rows
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
UPDATE LAST USED
=========================================
*/
exports.useTemplate = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(`
      UPDATE templates
      SET
      is_recent = 1,
      last_used = NOW()
      WHERE id = ?
    `,[id]);

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
GET RECENT
=========================================
*/
exports.getRecentTemplates = async (req, res) => {

  try {

    const [templates] = await db.query(`
      SELECT *
      FROM templates
      WHERE is_recent = 1
      ORDER BY last_used DESC
      LIMIT 20
    `);

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
SAME SIZE TEMPLATES
=========================================
*/
exports.getTemplatesBySizeAndCategory =
async (req, res) => {

  try {

    const { id } = req.params;

    const [current] = await db.query(`
      SELECT
        category,
        width,
        height
      FROM templates
      WHERE id = ?
    `,[id]);

    if (!current.length) {

      return res.status(404).json({
        success: false,
        message: "Template not found"
      });

    }

    const {
      category,
      width,
      height
    } = current[0];

    const [templates] = await db.query(`
      SELECT *
      FROM templates
      WHERE category = ?
      AND width = ?
      AND height = ?
      AND id != ?
      ORDER BY id DESC
    `,
    [
      category,
      width,
      height,
      id
    ]);

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
TEMPLATE DETAILS
=========================================
*/
exports.getTemplateDetails = async (req,res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT
      id,
      title,
      about,
      tag1,
      tag2,
      tag3,
      tag4,
      tag5
      FROM templates
      WHERE id = ?
    `,[id]);

    if(!rows.length){

      return res.status(404).json({
        success:false
      });

    }

    const template = rows[0];

    res.json({
      success:true,
      details:{
        id:template.id,
        title:template.title,
        about:template.about,
        tags:[
          template.tag1,
          template.tag2,
          template.tag3,
          template.tag4,
          template.tag5
        ].filter(Boolean)
      }
    });

  } catch(error){

    res.status(500).json({
      success:false,
      error:error.message
    });

  }

};


/*
=========================================
RELATED TAGS
=========================================
*/
exports.getRelatedTemplates = async (req,res) => {

  try {

    const { id } = req.params;

    const [current] = await db.query(`
      SELECT *
      FROM templates
      WHERE id = ?
    `,[id]);

    if(!current.length){

      return res.status(404).json({
        success:false
      });

    }

    const template = current[0];

    const tags = [
      template.tag1,
      template.tag2,
      template.tag3,
      template.tag4,
      template.tag5
    ].filter(Boolean);

    if(!tags.length){

      return res.json({
        success:true,
        templates:[]
      });

    }

    const placeholders =
      tags.map(() => "?").join(",");

    const [templates] = await db.query(`
      SELECT *
      FROM templates
      WHERE id != ?
      AND (
        tag1 IN (${placeholders})
        OR tag2 IN (${placeholders})
        OR tag3 IN (${placeholders})
        OR tag4 IN (${placeholders})
        OR tag5 IN (${placeholders})
      )
    `,
    [
      id,
      ...tags,
      ...tags,
      ...tags,
      ...tags,
      ...tags
    ]);

    res.json({
      success:true,
      templates
    });

  } catch(error){

    res.status(500).json({
      success:false,
      error:error.message
    });

  }

};