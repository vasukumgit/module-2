const db = require("../../config/db");
function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

// ===============================
// CREATE ELEMENT
// ===============================
exports.createElement = async (req, res) => {
  try {
    const data = req.body;
    const user_id = req.user.id;
    if (data.width && typeof data.width !== "number") {
  return res.status(400).json({ message: "Invalid width" });
}

if (data.height && typeof data.height !== "number") {
  return res.status(400).json({ message: "Invalid height" });
}

    if (!data.design_id || !data.type) {
      return res.status(400).json({
        success: false,
        message: "design_id and type required"
      });
    }

    // check ownership
    const [design] = await db.execute(
      "SELECT id FROM designs WHERE id=? AND user_id=?",
      [data.design_id, user_id]
    );

    if (!design.length) {
      return res.status(404).json({
        success: false,
        message: "Design not found"
      });
    }

    const sql = `
      INSERT INTO editor (
        design_id, object_id, type, text,
        font_family, font_size, color,
        x, y, width, height,
        rotation, opacity, layer,
        properties,
        chart_type, chart_data, chart_labels, table_data
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    
    const defaultProperties = {
  transform: {
    x: data.x ?? 0,
    y: data.y ?? 0,
    width: data.width ?? 100,
    height: data.height ?? 50,
    rotation: data.rotation ?? 0,
    scaleX: 1,
    scaleY: 1
  },
  style: {
    fill: data.color || "#000000",
    opacity: data.opacity ?? 1
  },
  text: {
    content: data.text || "",
    fontSize: data.font_size || 16,
    fontFamily: data.font_family || "Arial"
  },
  meta: {
    locked: false,
    visible: true
  }
};

//  ADD THIS
const finalProperties = deepMerge(
  defaultProperties,
  data.properties || {}
);
    const [result] = await db.execute(sql, [
      data.design_id,
      data.object_id || null,
      data.type,
      data.text || null,
      data.font_family || null,
      data.font_size || null,
      data.color || null,
      data.x ?? 0,
      data.y ?? 0,
      data.width ?? 100,
      data.height ?? 50,
      data.rotation ?? 0,
      data.opacity ?? 1,
      data.layer ?? 1,
      JSON.stringify(finalProperties),
      data.chart_type || null,
      data.chart_data || null,
      data.chart_labels || null,
      data.table_data || null
    ]);

    res.json({
      success: true,
      elementId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// GET ELEMENTS BY DESIGN
// ===============================
exports.getElements = async (req, res) => {
  try {
    const { designId } = req.params;
    const user_id = req.user.id;

    const sql = `
      SELECT e.*
      FROM editor e
      JOIN designs d ON e.design_id = d.id
      WHERE e.design_id = ?
      AND d.user_id = ?
      AND d.is_deleted = 0
      ORDER BY e.layer ASC
    `;

    const [rows] = await db.execute(sql, [designId, user_id]);

    const formatted = rows.map(el => {
      let parsedProps = {};

      try {
        parsedProps =
          typeof el.properties === "string"
            ? JSON.parse(el.properties)
            : el.properties || {};
      } catch {
        parsedProps = {};
      }

      return {
        ...el,
        properties: parsedProps
      };
    });

    res.json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// ===============================
// GET SINGLE ELEMENT
// ===============================
exports.getSingleElement = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const sql = `
      SELECT e.*
      FROM editor e
      JOIN designs d ON e.design_id = d.id
      WHERE e.id = ?
      AND d.user_id = ?
    `;

    const [rows] = await db.execute(sql, [id, user_id]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Element not found"
      });
    }

    let parsedProps = {};

    try {
      parsedProps =
        typeof rows[0].properties === "string"
          ? JSON.parse(rows[0].properties)
          : rows[0].properties || {};
    } catch {
      parsedProps = {};
    }

    const element = {
      ...rows[0],
      properties: parsedProps
    };

    res.json({
      success: true,
      data: element
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// ===============================
// UPDATE ELEMENT (Editor Panel Main)
// ===============================
exports.updateElement = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const fields = [];
    const values = [];

    let mergedProperties = null;

    // 👉 HANDLE PROPERTIES SEPARATELY
    if (req.body.properties) {
      const [rows] = await db.execute(
        `SELECT e.properties
         FROM editor e
         JOIN designs d ON e.design_id = d.id
         WHERE e.id = ? AND d.user_id = ?`,
        [id, user_id]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "Element not found" });
      }

      let oldProps = rows[0].properties;

      if (typeof oldProps === "string") {
        oldProps = JSON.parse(oldProps);
      }

      mergedProperties = deepMerge(oldProps || {}, req.body.properties);

      fields.push(`e.properties = ?`);
      values.push(JSON.stringify(mergedProperties));
    }

    // 👉 OTHER FIELDS
    Object.entries(req.body).forEach(([key, value]) => {
      if (key !== "properties") {
        fields.push(`e.${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const sql = `
      UPDATE editor e
      JOIN designs d ON e.design_id = d.id
      SET ${fields.join(", ")}
      WHERE e.id = ? AND d.user_id = ?
    `;

    values.push(id, user_id);

    await db.execute(sql, values);

    // res.json({
    //   success: true,
    //   properties: mergedProperties
    // });
    res.json({
  success: true,
  updatedId: id,
  properties: mergedProperties || undefined
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ===============================
// DELETE ELEMENT
// ===============================
exports.deleteElement = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const sql = `
      DELETE e FROM editor e
      JOIN designs d ON e.design_id = d.id
      WHERE e.id = ?
      AND d.user_id = ?
    `;

    await db.execute(sql, [id, user_id]);

    res.json({
      success: true,
      message: "Element deleted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};